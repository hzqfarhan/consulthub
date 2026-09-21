'use client';

import React, { useState } from 'react';
import { getProfileImageUrl } from '@/lib/data';

/**
 * UTHMAvatar component resolving student & staff photos from community.uthm.edu.my
 * with graceful fallback to monogram initial avatars when 404 or missing.
 */
export default function UTHMAvatar({
  user,
  name = '',
  email = '',
  idNumber = '',
  size = 36,
  className = '',
}) {
  const [hasError, setHasError] = useState(false);

  // Normalize user data if passed as object
  const resolvedName = user?.name || name || 'User';
  const resolvedEmail = user?.email || email || '';
  const resolvedId =
    user?.matric || user?.staffId || idNumber || '';
  const resolvedAvatarInitial =
    user?.avatar || (resolvedName ? resolvedName.charAt(0).toUpperCase() : 'U');

  const imageUrl = getProfileImageUrl(resolvedEmail, resolvedId);

  if (hasError || !imageUrl) {
    return (
      <div
        className={`avatar ${className}`}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      >
        {resolvedAvatarInitial}
      </div>
    );
  }

  return (
    <div
      className={`avatar avatar-img-wrapper ${className}`}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
    >
      <img
        src={imageUrl}
        alt={resolvedName}
        className="avatar-img"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
