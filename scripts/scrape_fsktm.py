#!/usr/bin/env python3
"""
FSKTM Faculty & Teaching Subject Scraper (Full Pipeline with Telefon Room Directory)
===================================================================================
1. https://telefon.uthm.edu.my/fakulti/senarai2/19 (Exact Office Room & Phone Numbers)
2. https://fsktm.uthm.edu.my/directory/ (Directory, Roles, Photos, Specialities)
3. https://community.uthm.edu.my/<username> (Active Teaching Experience Table #TEA & #FOE)

Target Faculty: FSKTM ONLY (FID 19)
"""

import os
import sys
import re
import json
import time
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any

try:
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry
    from bs4 import BeautifulSoup
    import urllib3
    urllib3.disable_warnings()
except ImportError:
    print("[!] Dependencies missing. Run: pip install requests beautifulsoup4 urllib3")
    sys.exit(1)

DIRECTORY_URL = "https://fsktm.uthm.edu.my/directory/"
TELEFON_URL = "https://telefon.uthm.edu.my/fakulti/senarai2/19"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ms;q=0.8"
}

def get_resilient_session(retries: int = 4, backoff_factor: float = 1.0) -> requests.Session:
    session = requests.Session()
    retry_strategy = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=[429, 500, 502, 503, 504],
        raise_on_status=False
    )
    adapter = HTTPAdapter(max_retries=retry_strategy, pool_connections=25, pool_maxsize=25)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    session.headers.update(HEADERS)
    return session

GLOBAL_SESSION = get_resilient_session()

COURSE_CODE_REGEX = re.compile(r"\[(?P<code>[A-Z0-9]{6,8})\]|\b(?P<raw_code>[A-Z]{2,4}\d{1,5})\b")
SESSION_REGEX = re.compile(r"(?:Session|Sesi)\s*2026[/\-]?2027\s*(?:Semester|Sem)\s*1", re.IGNORECASE)
IGNORE_KEYWORDS = [
    "assessor", "reviewer", "committee", "member", "task force", "invigilator",
    "speaker", "auditor", "panel", "judge", "facilitator", "penilai", "jawatankuasa",
    "pemeriksa", "pengawas", "pembentangan", "bengkel", "workshop", "mesyuarat"
]

def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", re.sub(r"[\r\n\t]+", " ", text)).strip()

def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

def extract_academic_title(name: str) -> tuple[str, str]:
    patterns = [
        r"^(PROF\.\s*MADYA\s*Ts\.\s*Dr\.)",
        r"^(PROF\.\s*MADYA\s*Dr\.)",
        r"^(PROF\.\s*MADYA\s*Ts\.)",
        r"^(PROF\.\s*MADYA\s*Ir\.\s*Dr\.)",
        r"^(PROF\.\s*MADYA)",
        r"^(PROF\.\s*Ts\.\s*Dr\.)",
        r"^(PROF\.\s*Dr\.)",
        r"^(PROF\.)",
        r"^(ASSOC\.\s*PROF\.\s*Ts\.\s*Dr\.)",
        r"^(ASSOC\.\s*PROF\.\s*Dr\.)",
        r"^(ASSOC\.\s*PROF\.)",
        r"^(Ts\.\s*Dr\.)",
        r"^(Ir\.\s*Dr\.)",
        r"^(Dr\.)",
        r"^(Ts\.)",
        r"^(Ir\.)",
        r"^(PUAN|PN\.)",
        r"^(ENCIK|EN\.)",
        r"^(CIK)",
        r"^(DATO'|DATUK|DATIN)"
    ]
    clean_n = name
    title_str = ""
    for pat in patterns:
        m = re.match(pat, clean_n, re.IGNORECASE)
        if m:
            title_str = m.group(0).strip()
            clean_n = clean_n[m.end():].strip(" ,.")
            break
    return title_str, clean_n

def clean_tokens(text: str) -> set:
    clean = re.sub(r"^(PROF\.|ASSOC\.|DR\.|TS\.|IR\.|PM|EN\.|PN\.|CIK|MR\.|MS\.|MADYA|PUAN|ENCIK)\s+", "", text, flags=re.IGNORECASE)
    clean = re.sub(r"\b(BIN|BINTI|A\/L|A\/P|MD\.|MOHD|ABD)\b", "", clean, flags=re.IGNORECASE)
    return set(re.findall(r"[a-zA-Z]{3,}", clean.lower()))

def fetch_telefon_room_directory() -> List[Dict[str, str]]:
    print(f"[*] Fetching UTHM Telefon Directory (FID 19): {TELEFON_URL}")
    entries = []
    try:
        resp = GLOBAL_SESSION.get(TELEFON_URL, timeout=15, verify=False)
        if resp.status_code != 200:
            print(f"[!] Telefon directory returned status code {resp.status_code}")
            return entries

        soup = BeautifulSoup(resp.content, "html.parser")
        for tr in soup.find_all("tr"):
            tds = tr.find_all("td")
            if len(tds) >= 4:
                name_raw = clean_text(tds[0].get_text())
                role_raw = clean_text(tds[1].get_text())
                ext_phone = clean_text(tds[2].get_text())
                email_room_raw = clean_text(tds[3].get_text(" "))

                if not name_raw or name_raw == "-" or "Nama" in name_raw:
                    continue

                # Room parsing with PB/PC regex resilience
                room = ""
                username = ""
                pb_match = re.search(r"(PB-?\s*\d{3}-\d{2}[A-Za-z]?|PC-?\s*\d{3}-\d{2}[A-Za-z]?|C19-\d{3}-\d{2})", email_room_raw, re.I)
                if pb_match:
                    raw_room = pb_match.group(0).upper().replace(" ", "")
                    if not raw_room.startswith("PB-") and raw_room.startswith("PB"):
                        room = "PB-" + raw_room[2:].lstrip("-")
                    elif not raw_room.startswith("PC-") and raw_room.startswith("PC"):
                        room = "PC-" + raw_room[2:].lstrip("-")
                    else:
                        room = raw_room
                    # strip room to obtain pure username
                    clean_str = re.sub(r"(PB-?\s*\d{3}-\d{2}[A-Za-z]?|PC-?\s*\d{3}-\d{2}[A-Za-z]?|C19-\d{3}-\d{2})", "", email_room_raw, flags=re.I).strip()
                    tokens = clean_str.split()
                    if tokens:
                        username = tokens[0].lower().replace("@uthm.edu.my", "").strip()
                else:
                    tokens = email_room_raw.split()
                    if tokens:
                        username = tokens[0].lower().replace("@uthm.edu.my", "").strip()
                        room = " ".join(tokens[1:]).strip() if len(tokens) > 1 else ""
                        room = re.sub(r"PB\s+", "PB-", room)
                        room = re.sub(r"PC\s+", "PC-", room)

                full_phone = f"07-950 {ext_phone}" if (ext_phone.isdigit() and len(ext_phone) == 4) else ext_phone

                entries.append({
                    "name": name_raw,
                    "role": role_raw,
                    "username": username,
                    "room": room,
                    "phone": full_phone
                })
        print(f"[+] Loaded {len(entries)} room & phone records from Telefon directory.")
    except Exception as e:
        print(f"[!] Warning: Could not fetch telefon directory: {e}")
    return entries

def scrape_community_teaching_and_foe(community_url: str) -> tuple[List[Dict[str, Any]], List[str], str]:
    """Extracts active semester courses from #TEA, expertise from #FOE, and profile avatar."""
    subjects = []
    foe_areas = []
    avatar_url = ""

    if not community_url or "community.uthm.edu.my" not in community_url:
        return subjects, foe_areas, avatar_url

    for attempt in range(3):
        try:
            resp = GLOBAL_SESSION.get(community_url, timeout=(5, 12), verify=False)
            if resp.status_code != 200:
                time.sleep(0.5 * (attempt + 1))
                continue

            soup = BeautifulSoup(resp.content, "html.parser")

            # 1. Profile image
            for img in soup.find_all("img"):
                src = img.get("src", "")
                if "files/profile" in src or "profile" in src:
                    avatar_url = urljoin(community_url, src).replace("./files", "files")
                    break

            # 2. Teaching table (#TEA)
            tea = soup.find(id="TEA") or soup.find(id="teaching")
            table = None
            if tea:
                table = tea.find_next("table")
            else:
                for t in soup.find_all("table"):
                    txt = t.get_text().lower()
                    if "semester" in txt or "session" in txt:
                        table = t
                        break

            if table:
                seen_codes = set()
                for row in table.find_all("tr"):
                    cols = row.find_all(["td", "th"])
                    if len(cols) >= 2:
                        desc_val = clean_text(cols[1].get_text())

                        # Filter non-teaching roles
                        if any(k in desc_val.lower() for k in IGNORE_KEYWORDS):
                            continue

                        # Strict Current Semester Filter (2026/2027 Semester 1)
                        if not SESSION_REGEX.search(desc_val):
                            continue

                        code_match = COURSE_CODE_REGEX.search(desc_val)
                        if not code_match:
                            continue

                        code = (code_match.group("code") or code_match.group("raw_code") or "").upper().strip()
                        if not code or len(code) < 6:
                            continue

                        name_clean = COURSE_CODE_REGEX.sub("", desc_val)
                        name_clean = re.sub(r"(?:Session|Sesi)\s*\d{4}[/\-]?\d{4}\s*(?:Semester|Sem)\s*\d.*", "", name_clean, flags=re.IGNORECASE)
                        name_clean = re.sub(r"Universiti Tun Hussein Onn Malaysia.*", "", name_clean, flags=re.IGNORECASE)
                        name_clean = clean_text(name_clean).strip(" -:;,[]()")
                        if not name_clean:
                            name_clean = code

                        if code not in seen_codes:
                            seen_codes.add(code)
                            subjects.append({
                                "code": code,
                                "name": name_clean,
                                "session": "Session 20262027 Semester 1",
                                "year": "2026",
                                "isCurrentSemester": True
                            })

            # 3. Field of Expertise (#FOE)
            foe = soup.find(id="FOE") or soup.find(id="expertise")
            if foe:
                foe_table = foe.find_next("table")
                if foe_table:
                    for r in foe_table.find_all("tr"):
                        tds = r.find_all("td")
                        for td in tds:
                            area_txt = clean_text(td.get_text())
                            if area_txt and len(area_txt) > 3 and area_txt not in foe_areas:
                                foe_areas.append(area_txt)

            return subjects, foe_areas, avatar_url
        except Exception:
            if attempt < 2:
                time.sleep(1.0 * (attempt + 1))

    return subjects, foe_areas, avatar_url

def scrape_all_fsktm() -> List[Dict[str, Any]]:
    telefon_records = fetch_telefon_room_directory()

    print(f"[*] Fetching FSKTM Web Directory: {DIRECTORY_URL}")
    resp = GLOBAL_SESSION.get(DIRECTORY_URL, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.content, "html.parser")

    # Map tables directly by following h1/h2/h3 headings
    tables = soup.find_all("table")
    dept_mappings = []

    for t in tables:
        # Check previous heading
        prev_h = t.find_previous(["h1", "h2", "h3"])
        htext = clean_text(prev_h.get_text()) if prev_h else "FSKTM Faculty"
        dept_name = "Department of Software Engineering"

        if "Dean" in htext and "Deputy" not in htext:
            dept_name = "Dean's Office"
        elif "Deputy" in htext:
            dept_name = "Deputy Dean's Office"
        elif "Administrative" in htext:
            dept_name = "Administrative Division"
        elif "Postgraduate" in htext:
            dept_name = "Postgraduate Studies"
        elif "Software" in htext:
            dept_name = "Department of Software Engineering"
        elif "Security" in htext or "Web" in htext:
            dept_name = "Department of Information Security & Web Technology"
        elif "Multimedia" in htext:
            dept_name = "Department of Multimedia Computing"
        elif "ICT" in htext:
            dept_name = "ICT Division"

        dept_mappings.append((dept_name, t))

    print(f"[+] Found {len(dept_mappings)} department table blocks.")
    lecturers = []
    seen_names = set()

    for dept_name, tbl in dept_mappings:
        for row in tbl.find_all("tr", class_="el-item"):
            title_el = row.find(class_="el-title") or row.find(["h3", "h4", "strong"])
            if not title_el:
                continue
            raw_name = clean_text(title_el.get_text())
            if not raw_name or raw_name in seen_names:
                continue
            seen_names.add(raw_name)

            meta_el = row.find(class_="el-meta")
            role = clean_text(meta_el.get_text(" ")) if meta_el else "Lecturer"

            content_el = row.find(class_="el-content")
            content_text = content_el.get_text("\n") if content_el else ""

            # Email extraction
            email = ""
            mailto = row.find("a", href=lambda h: h and h.startswith("mailto:"))
            if mailto:
                email = mailto["href"].replace("mailto:", "").split("?")[0].strip().lower()
            else:
                em = re.search(r"[\w\.-]+@uthm\.edu\.my", content_text, re.IGNORECASE)
                if em:
                    email = em.group(0).lower()

            # Staff ID extraction
            staff_id = ""
            img_el = row.find("img")
            img_src = img_el.get("src", "") if img_el else ""
            if img_src:
                id_match = re.search(r"(\d{4,6})-[a-f0-9]+\.(?:jpg|jpeg|webp|avif|png)", img_src, re.IGNORECASE)
                if id_match:
                    staff_id = id_match.group(1)

            # Phone from content
            ph_match = re.search(r"(?:07-?\s*950\s*\d{4}|\+?60\s*\d{1,2}-?\d{7,8})", content_text)
            phone = clean_text(ph_match.group(0)) if ph_match else ""

            # Fallback room from content
            room_match = re.search(r"(?:PB-?\s*\d{3}-\d{2}[A-Za-z]?|PC-?\s*\d{3}-\d{2}[A-Za-z]?|C19-\d{3}-\d{2}|Bilik\s*[\w\d-]+)", content_text, re.IGNORECASE)
            room_location = room_match.group(0).upper().replace("BILIK", "").strip() if room_match else ""
            if room_location:
                room_location = re.sub(r"PB\s*", "PB-", room_location)
                room_location = re.sub(r"PC\s*", "PC-", room_location)

            # Username
            uname = email.split("@")[0].lower() if email else ""
            if not uname and img_el and img_el.get("alt"):
                uname = img_el.get("alt").strip().lower()

            # Cross-reference with Telefon records for exact Office Room Number & direct Phone
            lec_tokens = clean_tokens(raw_name)
            matched_tel = False

            # Tier 1: Exact username match
            if uname:
                for tel in telefon_records:
                    if tel["username"] and (tel["username"] == uname or tel["username"] in uname):
                        if tel["room"]:
                            room_location = tel["room"]
                        if tel["phone"]:
                            phone = tel["phone"]
                        matched_tel = True
                        break

            # Tier 2: Token intersection match
            if not matched_tel:
                for tel in telefon_records:
                    tel_tokens = clean_tokens(tel["name"])
                    if len(lec_tokens.intersection(tel_tokens)) >= 2:
                        if tel["room"]:
                            room_location = tel["room"]
                        if tel["phone"] and not phone:
                            phone = tel["phone"]
                        if not uname and tel["username"]:
                            uname = tel["username"]
                        break

            # Avatar URL
            avatar_url = ""
            if staff_id:
                avatar_url = f"https://community.uthm.edu.my/files/profile/{staff_id}.jpeg"
            elif img_src:
                avatar_url = urljoin(DIRECTORY_URL, img_src)

            # Community URL
            link_el = row.find("a", class_="el-link") or row.find("a", href=lambda h: h and "community.uthm.edu.my" in h)
            community_url = link_el["href"] if link_el and link_el.get("href") else (f"https://community.uthm.edu.my/{uname}" if uname else "")

            # Research Specialities
            specialities = []
            for line in content_text.split("\n"):
                line = clean_text(line)
                if not line or "@" in line or (phone and phone in line) or (room_location and room_location in line):
                    continue
                if len(line) > 4 and not any(line.startswith(p) for p in ["Tel:", "Phone:", "Email:", "Ext:", "More Info"]):
                    parts = [p.strip() for p in line.split(",") if len(p.strip()) > 3]
                    specialities.extend(parts if len(parts) > 1 else [line])

            title_str, clean_n = extract_academic_title(raw_name)
            lec_id = f"fsktm-{slugify(clean_n) or slugify(uname)}"
            is_academic = any(k in role.lower() or k in title_str.lower() for k in ["profesor", "prof", "dr", "pensyarah", "lecturer", "dean", "tutor", "fellow"])

            lecturers.append({
                "id": lec_id,
                "name": raw_name,
                "cleanName": clean_n,
                "title": title_str,
                "role": role,
                "staffId": staff_id,
                "facultyCode": "FSKTM",
                "facultyName": "Fakulti Sains Komputer dan Teknologi Maklumat",
                "department": dept_name,
                "username": uname,
                "email": email or (f"{uname}@uthm.edu.my" if uname else ""),
                "phone": phone or "07-950 8000",
                "roomLocation": room_location or "FSKTM Faculty Complex",
                "avatarUrl": avatar_url,
                "communityUrl": community_url,
                "specialities": specialities[:5],
                "currentSubjects": [],
                "isAvailableFYP": is_academic
            })

    print(f"[+] Parsed {len(lecturers)} FSKTM staff members from Web Directory.")

    # Concurrently enrich active teaching subjects from Community portal
    print("[*] Concurrently enriching active teaching subjects (#TEA) and expertise (#FOE)...")
    def enrich_worker(lec):
        if lec.get("communityUrl") and "community.uthm.edu.my" in lec["communityUrl"]:
            subs, foe_tags, comm_avatar = scrape_community_teaching_and_foe(lec["communityUrl"])
            return lec["id"], subs, foe_tags, comm_avatar
        return lec["id"], [], [], ""

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(enrich_worker, lec) for lec in lecturers]
        for fut in as_completed(futures):
            lec_id, subs, foe_tags, comm_avatar = fut.result()
            for lec in lecturers:
                if lec["id"] == lec_id:
                    if subs:
                        lec["currentSubjects"] = subs
                    if foe_tags and not lec["specialities"]:
                        lec["specialities"] = foe_tags[:5]
                    elif foe_tags and len(lec["specialities"]) < 5:
                        for tag in foe_tags:
                            if tag not in lec["specialities"] and len(lec["specialities"]) < 5:
                                lec["specialities"].append(tag)
                    if comm_avatar and (not lec["avatarUrl"] or "yootheme" in lec["avatarUrl"]):
                        lec["avatarUrl"] = comm_avatar
                    break

    return lecturers

def export_raw_results(lecturers: List[Dict[str, Any]]):
    base_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(base_dir, exist_ok=True)
    json_path = os.path.join(base_dir, "lecturers.raw.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(lecturers, f, indent=2, ensure_ascii=False)
    print(f"[+] Successfully exported {len(lecturers)} raw records to {json_path}")

if __name__ == "__main__":
    records = scrape_all_fsktm()
    if records:
        export_raw_results(records)
