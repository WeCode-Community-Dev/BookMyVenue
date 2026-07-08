package com.example.bookmyvenue.data

import android.content.Context
import android.net.Uri
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okio.BufferedSink
import java.io.InputStream

fun Context.createMultipartImagePart(uri: Uri, partName: String): MultipartBody.Part? {
    val contentResolver = this.contentResolver
    val mimeType = contentResolver.getType(uri) ?: "image/jpeg"

    val requestBody = object : RequestBody() {
        override fun contentType() = mimeType.toMediaTypeOrNull()

        override fun contentLength(): Long {
            return contentResolver.openAssetFileDescriptor(uri, "r")?.use {
                it.length
            } ?: -1
        }

        override fun writeTo(sink: BufferedSink) {
            contentResolver.openInputStream(uri)?.use { inputStream ->
                val buffer = ByteArray(4096)
                var bytesRead: Int
                while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                    sink.write(buffer, 0, bytesRead)
                }
            }
        }
    }

    val fileName = "venue_upload_${System.currentTimeMillis()}.jpg"
    return MultipartBody.Part.createFormData(partName, fileName, requestBody)
}