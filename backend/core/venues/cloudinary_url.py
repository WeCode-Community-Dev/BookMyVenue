from __future__ import annotations

import re
from enum import Enum
from urllib.parse import urlsplit, urlunsplit


class CloudinaryImagePreset(str, Enum):
    CATEGORY_ICON = "w_480,h_288,c_fill,f_auto,q_auto"
    LIST_COVER = "w_800,h_520,c_fill,f_auto,q_auto"
    DETAIL_HERO = "w_1600,h_900,c_fill,f_auto,q_auto"


_UPLOAD_MARKER = "/image/upload/"
_VERSION_SEGMENT = re.compile(r"^v\d+$")
_TRANSFORM_SEGMENT = re.compile(r"^(?:[a-z]{1,3}_|[^,/]+,)")


def transform_cloudinary_url(
    url: str | None,
    preset: CloudinaryImagePreset | str,
) -> str | None:
    """Insert a Cloudinary delivery transform into an upload URL.

    Leaves non-Cloudinary URLs (and falsy values) unchanged. If a transform
    segment is already present after ``/image/upload/``, it is replaced.
    """
    if not url:
        return url

    transform = preset.value if isinstance(preset, CloudinaryImagePreset) else preset
    if not transform:
        return url

    parts = urlsplit(url)
    if "res.cloudinary.com" not in parts.netloc:
        return url

    path = parts.path
    marker_index = path.find(_UPLOAD_MARKER)
    if marker_index < 0:
        return url

    prefix = path[: marker_index + len(_UPLOAD_MARKER)]
    remainder = path[marker_index + len(_UPLOAD_MARKER) :]
    if not remainder:
        return url

    first_segment, sep, rest = remainder.partition("/")
    if sep and _TRANSFORM_SEGMENT.match(first_segment) and not _VERSION_SEGMENT.match(
        first_segment,
    ):
        resource_path = rest
    else:
        resource_path = remainder

    if not resource_path:
        return url

    new_path = f"{prefix}{transform}/{resource_path}"
    return urlunsplit(
        (parts.scheme, parts.netloc, new_path, parts.query, parts.fragment),
    )
