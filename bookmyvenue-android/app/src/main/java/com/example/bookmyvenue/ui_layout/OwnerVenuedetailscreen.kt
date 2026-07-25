package com.example.bookmyvenue.ui_layout

import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.bookmyvenue.data.BackendVenueItem
import com.example.bookmyvenue.data.OwnerDashboardViewModel

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun OwnerVenueDetailScreen(
    venue: BackendVenueItem,
    viewModel: OwnerDashboardViewModel,
    onBackClick: () -> Unit,
    onManageSlotsClick: (String) -> Unit,
    onUpdateVenueClick: (String, Double, Int, String, List<String>, List<String>) -> Unit,
    modifier: Modifier = Modifier
) {
    val brandRed = Color(0xFFE51E26)
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    var isEditMode by remember { mutableStateOf(false) }
    var showWarningDialog by remember { mutableStateOf(false) }

    var editablePrice by remember { mutableStateOf(venue.pricePerHour.toString()) }
    var editableCapacity by remember { mutableStateOf(venue.capacity.toString()) }
    var editableDescription by remember { mutableStateOf(venue.description ?: "") }

    var editableAmenityInput by remember { mutableStateOf("") }
    val editableAmenities = remember { mutableStateListOf(*venue.amenities?.toTypedArray() ?: arrayOf()) }

    val editableImageUrls = remember { mutableStateListOf(*venue.imageUrls?.toTypedArray() ?: arrayOf()) }

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            if (editableImageUrls.size >= 6) {
                Toast.makeText(context, "Maximum 6 photos allowed", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.uploadVenueImage(context, uri)
            }
        }
    }

    LaunchedEffect(viewModel.uploadedImageUrls.size) {
        viewModel.uploadedImageUrls.forEach { url ->
            if (!editableImageUrls.contains(url) && editableImageUrls.size < 6) {
                editableImageUrls.add(url)
            }
        }
    }

    val pagerState = rememberPagerState(pageCount = { if (editableImageUrls.isEmpty()) 1 else editableImageUrls.size })

    if (showWarningDialog) {
        AlertDialog(
            onDismissRequest = { showWarningDialog = false },
            title = { Text("Re-Verification Required", fontWeight = FontWeight.Bold) },
            text = {
                Text("Updating details will set your venue status back to PENDING for Admin review. Your listing will be temporarily hidden until re-approved. Do you want to continue?")
            },
            confirmButton = {
                Button(
                    onClick = {
                        showWarningDialog = false
                        val parsedPrice = editablePrice.toDoubleOrNull() ?: venue.pricePerHour
                        val parsedCapacity = editableCapacity.toIntOrNull() ?: venue.capacity

                        onUpdateVenueClick(
                            venue.id,
                            parsedPrice,
                            parsedCapacity,
                            editableDescription,
                            editableAmenities.toList(),
                            editableImageUrls.toList()
                        )
                        isEditMode = false
                        Toast.makeText(context, "Venue updated and submitted for review!", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                ) {
                    Text("Proceed", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showWarningDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (isEditMode) "Edit Venue" else venue.name, fontSize = 18.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { isEditMode = !isEditMode }) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit Venue", tint = brandRed)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        bottomBar = {
            Surface(
                color = Color.White,
                shadowElevation = 8.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    if (isEditMode) {
                        Button(
                            onClick = {
                                val parsedPrice = editablePrice.toDoubleOrNull()
                                val parsedCapacity = editableCapacity.toIntOrNull()

                                if (parsedPrice == null || parsedPrice <= 0) {
                                    Toast.makeText(context, "Please enter a valid price per hour", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }
                                if (parsedCapacity == null || parsedCapacity <= 0) {
                                    Toast.makeText(context, "Please enter a valid capacity", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }
                                if (editableImageUrls.size != 6) {
                                    Toast.makeText(context, "Exactly 6 photos are required!", Toast.LENGTH_LONG).show()
                                    return@Button
                                }

                                if (venue.moderationStatus.uppercase() == "APPROVED") {
                                    showWarningDialog = true
                                } else {
                                    onUpdateVenueClick(
                                        venue.id,
                                        parsedPrice,
                                        parsedCapacity,
                                        editableDescription,
                                        editableAmenities.toList(),
                                        editableImageUrls.toList()
                                    )
                                    isEditMode = false
                                    Toast.makeText(context, "Venue details saved!", Toast.LENGTH_SHORT).show()
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Text("Save Changes", fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    } else {
                        Button(
                            onClick = { onManageSlotsClick(venue.id) },
                            enabled = venue.moderationStatus.uppercase() == "APPROVED",
                            colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Text(
                                text = if (venue.moderationStatus.uppercase() == "APPROVED") "Configure & Manage Slots" else "Awaiting Admin Approval",
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFFF6F8FA))
                .verticalScroll(scrollState)
        ) {
            Box(modifier = Modifier.fillMaxWidth().height(220.dp)) {
                if (editableImageUrls.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color(0xFFE2E8F0)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Upload image from gallery",
                            color = Color.Gray,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                } else {
                    HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize()) { page ->
                        AsyncImage(
                            model = editableImageUrls[page],
                            contentDescription = null,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    }
                    Row(
                        Modifier
                            .wrapContentHeight()
                            .fillMaxWidth()
                            .align(Alignment.BottomCenter)
                            .padding(bottom = 12.dp),
                        horizontalArrangement = Arrangement.Center
                    ) {
                        repeat(editableImageUrls.size) { iteration ->
                            val color = if (pagerState.currentPage == iteration) brandRed else Color.White.copy(alpha = 0.6f)
                            Box(
                                modifier = Modifier
                                    .padding(3.dp)
                                    .clip(CircleShape)
                                    .background(color)
                                    .size(7.dp)
                            )
                        }
                    }
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if (isEditMode) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Manage Images", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Text(
                                    text = "${editableImageUrls.size} / 6 Photos",
                                    fontSize = 12.sp,
                                    color = if (editableImageUrls.size == 6) Color(0xFF10B981) else brandRed,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            LazyRow(
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                if (editableImageUrls.size < 6) {
                                    item {
                                        Box(
                                            modifier = Modifier
                                                .size(70.dp)
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(Color(0xFFF8FAFC))
                                                .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
                                                .clickable { galleryLauncher.launch("image/*") },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (viewModel.isUploadingImage) {
                                                CircularProgressIndicator(color = brandRed, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                                            } else {
                                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                                    Icon(Icons.Default.Add, contentDescription = null, tint = brandRed, modifier = Modifier.size(22.dp))
                                                    Text("Add", fontSize = 10.sp, color = brandRed, fontWeight = FontWeight.Bold)
                                                }
                                            }
                                        }
                                    }
                                }

                                items(editableImageUrls) { url ->
                                    Box(
                                        modifier = Modifier.size(70.dp).clip(RoundedCornerShape(8.dp))
                                    ) {
                                        AsyncImage(
                                            model = url,
                                            contentDescription = null,
                                            contentScale = ContentScale.Crop,
                                            modifier = Modifier.fillMaxSize()
                                        )
                                        IconButton(
                                            onClick = { editableImageUrls.remove(url) },
                                            modifier = Modifier
                                                .align(Alignment.TopEnd)
                                                .padding(2.dp)
                                                .size(20.dp)
                                                .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                                        ) {
                                            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.White, modifier = Modifier.size(12.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(text = "Category: ${venue.category.name}", fontSize = 12.sp, color = brandRed, fontWeight = FontWeight.Bold)
                        Text(text = venue.name, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text(text = "${venue.location}", fontSize = 14.sp, color = Color.Gray)

                        if (isEditMode) {
                            OutlinedTextField(
                                value = editableCapacity,
                                onValueChange = { editableCapacity = it },
                                label = { Text("Max Capacity (People)") },
                                modifier = Modifier.fillMaxWidth()
                            )
                            OutlinedTextField(
                                value = editablePrice,
                                onValueChange = { editablePrice = it },
                                label = { Text("Price Per Hour (₹)") },
                                modifier = Modifier.fillMaxWidth()
                            )
                        } else {
                            Text(text = "👥 Capacity: ${venue.capacity} People", fontSize = 14.sp, color = Color.DarkGray)
                            Text(text = "₹${venue.pricePerHour} / hour", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = brandRed)
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Offered Amenities", fontSize = 14.sp, fontWeight = FontWeight.Bold)

                        if (isEditMode) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                OutlinedTextField(
                                    value = editableAmenityInput,
                                    onValueChange = { editableAmenityInput = it },
                                    label = { Text("Add Amenity (e.g. AC)") },
                                    modifier = Modifier.weight(1f)
                                )
                                Button(
                                    onClick = {
                                        if (editableAmenityInput.isNotBlank()) {
                                            editableAmenities.add(editableAmenityInput.trim())
                                            editableAmenityInput = ""
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = brandRed)
                                ) {
                                    Text("Add")
                                }
                            }
                        }

                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(editableAmenities) { amenity ->
                                Surface(
                                    color = Color(0xFFF1F5F9),
                                    shape = RoundedCornerShape(6.dp),
                                    border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.5f))
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = amenity, fontSize = 12.sp, color = Color.DarkGray)
                                        if (isEditMode) {
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(
                                                text = "✕",
                                                color = Color.Red,
                                                fontSize = 12.sp,
                                                modifier = Modifier.clickable { editableAmenities.remove(amenity) }
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Description", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        if (isEditMode) {
                            OutlinedTextField(
                                value = editableDescription,
                                onValueChange = { editableDescription = it },
                                modifier = Modifier.fillMaxWidth().height(120.dp),
                                maxLines = 5
                            )
                        } else {
                            Text(
                                text = venue.description?.ifBlank { "No description provided." } ?: "No description provided.",
                                fontSize = 14.sp,
                                color = Color.DarkGray
                            )
                        }
                    }
                }
            }
        }
    }
}