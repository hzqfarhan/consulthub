#!/usr/bin/env python3
"""
Automated 5-Step Gatekeeper & Quality Assurance for FSKTM Lecturers
==================================================================
Reads: data/lecturers.raw.json (or data/lecturers.json)
Applies 5 strict gatekeeper rules:
  1. Identity Integrity: Must have non-empty id, name, and valid @uthm.edu.my email.
  2. Course Code Validity: Course code must be alphanumeric >= 6 characters.
  3. Temporal Alignment: Current semester only ('Session 20262027 Semester 1' or 'Session 2026/2027 Semester 1').
  4. Composite Uniqueness: No duplicate course codes per lecturer.
  5. Zero Speculative Assignment: If no courses confirmed in #TEA, leave empty.

Outputs:
  - data/lecturers.json (Clean universal JSON)
  - data/lecturers.ts   (Type-safe Next.js TypeScript export)
  - data/quarantine_log.json (Rejected records and reason logs)
"""

import os
import sys
import json
import re
from typing import List, Dict, Any

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@uthm\.edu\.my$", re.IGNORECASE)
COURSE_CODE_VALID_REGEX = re.compile(r"^[A-Z0-9]{6,8}$")
SESSION_VALID_REGEX = re.compile(r"(?:Session|Sesi)\s*2026[/\-]?2027\s*(?:Semester|Sem)\s*1", re.IGNORECASE)

def run_gatekeeper():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    raw_path = os.path.join(base_dir, "lecturers.raw.json")
    if not os.path.exists(raw_path):
        raw_path = os.path.join(base_dir, "lecturers.json")
    
    if not os.path.exists(raw_path):
        print(f"[!] Error: Raw data file not found at {raw_path}. Run scraper first.")
        sys.exit(1)

    with open(raw_path, "r", encoding="utf-8") as f:
        records: List[Dict[str, Any]] = json.load(f)

    clean_lecturers: List[Dict[str, Any]] = []
    quarantine_log: List[Dict[str, Any]] = []

    seen_ids = set()

    for idx, lec in enumerate(records):
        issues = []
        lec_id = lec.get("id", "").strip()
        lec_name = lec.get("name", "").strip()
        lec_email = lec.get("email", "").strip().lower()

        # Rule 1: Identity Integrity
        if not lec_id:
            issues.append("Rule 1 Violation: Missing lecturer ID")
        elif lec_id in seen_ids:
            issues.append(f"Rule 1 Violation: Duplicate lecturer ID '{lec_id}'")
        else:
            seen_ids.add(lec_id)

        if not lec_name:
            issues.append("Rule 1 Violation: Missing lecturer name")

        if not lec_email or not EMAIL_REGEX.match(lec_email):
            issues.append(f"Rule 1 Violation: Invalid or missing UTHM email '{lec_email}'")

        # If Rule 1 fails critically, quarantine entire lecturer record
        if issues:
            quarantine_log.append({
                "recordIndex": idx,
                "recordId": lec_id or f"unidentified-{idx}",
                "name": lec_name or "Unknown",
                "email": lec_email,
                "issues": issues,
                "quarantinedObject": lec
            })
            continue

        # Validate subjects for Rules 2, 3, 4, 5
        valid_subjects = []
        seen_course_codes = set()

        raw_subjects = lec.get("currentSubjects", [])
        for sub in raw_subjects:
            code = (sub.get("code") or "").upper().strip()
            name = (sub.get("name") or "").strip()
            session = (sub.get("session") or "").strip()

            # Rule 2: Course Code Validity
            if not code or not COURSE_CODE_VALID_REGEX.match(code):
                quarantine_log.append({
                    "recordId": lec_id,
                    "name": lec_name,
                    "issue": f"Rule 2 Violation: Malformed course code '{code}'",
                    "subject": sub
                })
                continue

            # Rule 3: Temporal Alignment
            if not SESSION_VALID_REGEX.search(session):
                quarantine_log.append({
                    "recordId": lec_id,
                    "name": lec_name,
                    "issue": f"Rule 3 Violation: Non-current semester session '{session}'",
                    "subject": sub
                })
                continue

            # Rule 4: Composite Uniqueness
            if code in seen_course_codes:
                quarantine_log.append({
                    "recordId": lec_id,
                    "name": lec_name,
                    "issue": f"Rule 4 Violation: Duplicate course code '{code}' for lecturer",
                    "subject": sub
                })
                continue

            seen_course_codes.add(code)
            valid_subjects.append({
                "code": code,
                "name": name or code,
                "session": "Session 20262027 Semester 1",
                "year": sub.get("year", "2026"),
                "isCurrentSemester": True
            })

        # Rule 5: Zero Speculative Assignment
        # If no verified subjects, keep currentSubjects as empty list
        lec["currentSubjects"] = valid_subjects

        clean_lecturers.append(lec)

    # Export clean universal JSON
    clean_json_path = os.path.join(base_dir, "lecturers.json")
    with open(clean_json_path, "w", encoding="utf-8") as f:
        json.dump(clean_lecturers, f, indent=2, ensure_ascii=False)

    # Export quarantine log
    quarantine_path = os.path.join(base_dir, "quarantine_log.json")
    with open(quarantine_path, "w", encoding="utf-8") as f:
        json.dump(quarantine_log, f, indent=2, ensure_ascii=False)

    # Export TypeScript file
    ts_path = os.path.join(base_dir, "lecturers.ts")
    ts_content = f"""/* =========================================================================
   FSKTM Lecturer Directory - Type-Safe Production Export
   Faculty of Computer Science and Information Technology, UTHM (FID 19)
   Session: 2026/2027 Semester 1
   ========================================================================= */

export interface ActiveSubject {{
  code: string;
  name: string;
  session: string;
  year: string;
  isCurrentSemester?: boolean;
}}

export interface Lecturer {{
  id: string;
  name: string;
  cleanName: string;
  title: string;
  role: string;
  staffId?: string;
  facultyCode: string;
  facultyName: string;
  department: string;
  username?: string;
  email: string;
  phone: string;
  roomLocation: string;
  avatarUrl?: string;
  communityUrl: string;
  specialities: string[];
  currentSubjects: ActiveSubject[];
  isAvailableFYP: boolean;
}}

export const FSKTM_LECTURERS: Lecturer[] = {json.dumps(clean_lecturers, indent=2, ensure_ascii=False)};

export default FSKTM_LECTURERS;
"""
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"[+] Gatekeeper complete:")
    print(f"    - Clean Records: {len(clean_lecturers)} -> {clean_json_path}")
    print(f"    - TypeScript Module: {ts_path}")
    print(f"    - Quarantined Events: {len(quarantine_log)} -> {quarantine_path}")

if __name__ == "__main__":
    run_gatekeeper()
