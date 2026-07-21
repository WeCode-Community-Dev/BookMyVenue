from app.modules.profile.schemas import ProfileResponse, UpdateProfileRequest


def get_profile(user_id: str) -> ProfileResponse:
    raise NotImplementedError


def update_profile(user_id: str, body: UpdateProfileRequest) -> ProfileResponse:
    raise NotImplementedError
