package com.example.bookmyvenue.data

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import okhttp3.MultipartBody
import retrofit2.http.Multipart
import retrofit2.http.Part

interface VenueApiService {

    @GET("api/venues")
    suspend fun getApprovedVenues(): Response<VenueResponse>

    @GET("api/categories")
    suspend fun getCategories(): Response<CategoryResponse>

    @GET("api/venues/me")
    suspend fun getOwnerVenues(
        @Header("Authorization") token: String
    ): Response<OwnerVenuesResponse>

    @POST("api/venues")
    suspend fun createVenue(
        @Header("Authorization") token: String,
        @Body request: RegisterVenueRequest
    ): Response<RegisterVenueResponse>

    @PATCH("api/venues/{id}/list")
    suspend fun listVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String
    ): Response<RegisterVenueResponse>

    @PATCH("api/venues/{id}/unlist")
    suspend fun unlistVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String
    ): Response<RegisterVenueResponse>

    @GET("api/venues/admin/all")
    suspend fun getAllVenuesForAdmin(
        @Header("Authorization") token: String
    ): Response<OwnerVenuesResponse>

    @PATCH("api/venues/admin/{id}/approve")
    suspend fun approveVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String
    ): Response<RegisterVenueResponse>

    @PATCH("api/venues/admin/{id}/reject")
    suspend fun rejectVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String,
        @Body body: RejectVenueRequest
    ): Response<RegisterVenueResponse>

    @GET("api/categories/admin/all")
    suspend fun getAllCategoriesForAdmin(
        @Header("Authorization") token: String
    ): Response<CategoryResponse>

    @POST("api/categories")
    suspend fun createCategory(
        @Header("Authorization") token: String,
        @Body request: CreateCategoryRequest
    ): Response<SingleCategoryResponse>

    @Multipart
    @POST("api/venues/upload")
    suspend fun uploadVenueImage(
        @Header("Authorization") authHeader: String,
        @Part image: MultipartBody.Part
    ): Response<UploadImageResponse>
}

data class RejectVenueRequest(
    val reason: String
)