from rest_framework.pagination import PageNumberPagination


class VenuePagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 24


class FeaturedVenuePagination(PageNumberPagination):
    page_size = 3
