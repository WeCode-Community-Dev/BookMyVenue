from django import forms

from venues.models import VenueCategory, VenueImage
from venues.services.image_upload_service import ImageUploadError, ImageUploadService


class _ImageFileInput(forms.ClearableFileInput):
    def __init__(self, attrs=None):
        attrs = {"accept": "image/*", **(attrs or {})}
        super().__init__(attrs=attrs)


def _upload_to_cloudinary(file) -> str:
    try:
        return ImageUploadService.upload_venue_image(file)["secure_url"]
    except ImageUploadError as exc:
        raise forms.ValidationError(str(exc)) from exc


class VenueImageAdminForm(forms.ModelForm):
    upload_image = forms.FileField(
        required=False,
        widget=_ImageFileInput,
        label="Upload image",
        help_text=(
            "Pick a file to upload it to Cloudinary. "
            "Leave blank to keep the current image or paste a URL below."
        ),
    )

    class Meta:
        model = VenueImage
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["image_url"].required = False

    def clean(self):
        cleaned_data = super().clean()
        upload = cleaned_data.get("upload_image")
        if upload:
            cleaned_data["image_url"] = _upload_to_cloudinary(upload)
        elif not cleaned_data.get("image_url"):
            raise forms.ValidationError(
                "Upload an image file or provide an image URL.",
            )
        return cleaned_data


class VenueCategoryAdminForm(forms.ModelForm):
    upload_icon = forms.FileField(
        required=False,
        widget=_ImageFileInput,
        label="Upload icon",
        help_text=(
            "Pick a file to upload it to Cloudinary. "
            "Leave blank to keep the current icon or paste a URL below."
        ),
    )

    class Meta:
        model = VenueCategory
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()
        upload = cleaned_data.get("upload_icon")
        if upload:
            cleaned_data["icon_url"] = _upload_to_cloudinary(upload)
        return cleaned_data
