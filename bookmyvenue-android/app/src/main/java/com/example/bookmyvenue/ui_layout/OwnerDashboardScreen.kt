package com.example.bookmyvenue.ui_layout

import android.location.Geocoder
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.bookmyvenue.data.OwnerDashboardViewModel
import com.google.android.gms.maps.model.LatLng
import java.util.Locale

data class OwnerVenueItem(
    val id: String,
    val name: String,
    val location: String,
    val pricePerHour: Double,
    val category: String,
    val status: String,
    val rejectReason: String? = null,
    val isListed: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OwnerDashboardScreen(
    viewModel: OwnerDashboardViewModel,
    onLogoutClick: () -> Unit,
    onToggleListing: (venueId: String, currentStatus: Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    var currentTab by remember { mutableStateOf(0) }
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val lightCanvasBg = Color(0xFFF6F8FA)

    var state = viewModel.ownerUiState
    var venuesList = remember { mutableStateOf(listOf<OwnerVenueItem>()) }
    var categoriesList = remember { mutableStateOf(listOf<String>()) }
    var ownerName = remember { mutableStateOf("Owner") }

    if (state is com.example.bookmyvenue.data.OwnerUiState.Success) {
        venuesList.value = state.venues
        categoriesList.value = state.categories
        ownerName.value = state.userName
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "BookMyVenue",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                },
                windowInsets = WindowInsets.statusBars,
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = brandDarkText
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 0.dp,
                modifier = Modifier.border(width = 0.5.dp, color = Color.LightGray.copy(alpha = 0.4f))
            ) {
                NavigationBarItem(
                    selected = currentTab == 0,
                    onClick = { currentTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Venues") },
                    label = { Text("My Venues", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
                NavigationBarItem(
                    selected = currentTab == 1,
                    onClick = { currentTab = 1 },
                    icon = { Icon(Icons.Default.Add, contentDescription = "Add Venue") },
                    label = { Text("Add Venue", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
                NavigationBarItem(
                    selected = currentTab == 2,
                    onClick = { currentTab = 2 },
                    icon = { Icon(Icons.Default.Info, contentDescription = "Bookings") },
                    label = { Text("Bookings", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
                NavigationBarItem(
                    selected = currentTab == 3,
                    onClick = { currentTab = 3 },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile", fontWeight = FontWeight.Medium) },
                    colors = NavigationBarItemDefaults.colors(selectedIconColor = brandRed, selectedTextColor = brandRed, unselectedIconColor = Color.Gray, unselectedTextColor = Color.Gray)
                )
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(lightCanvasBg)
        ) {
            when (currentTab) {
                0 -> OwnerVenuesTab(venues = venuesList.value, brandRed = brandRed, brandDarkText = brandDarkText, onToggleListing = onToggleListing)
                1 -> AddVenueTab(viewModel = viewModel, brandRed = brandRed, brandDarkText = brandDarkText, categories = categoriesList.value, onFormSuccessNavigation = { currentTab = 0 })
                2 -> OwnerBookingsTab(brandDarkText = brandDarkText)
                3 -> OwnerProfileTab(userName = ownerName.value, onLogoutClick = onLogoutClick, brandRed = brandRed, brandDarkText = brandDarkText)
            }
        }
    }
}

@Composable
fun OwnerVenuesTab(
    venues: List<OwnerVenueItem>,
    brandRed: Color,
    brandDarkText: Color,
    onToggleListing: (String, Boolean) -> Unit
) {
    var selectedStatusTab by remember { mutableStateOf(0) }

    val filteredVenues = remember(selectedStatusTab, venues) {
        when (selectedStatusTab) {
            0 -> venues.filter { it.status == "ACTIVE" }
            1 -> venues.filter { it.status == "PENDING" }
            else -> venues.filter { it.status == "REJECTED" }
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        TabRow(
            selectedTabIndex = selectedStatusTab,
            containerColor = Color.White,
            contentColor = brandRed,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    Modifier.tabIndicatorOffset(tabPositions[selectedStatusTab]),
                    color = brandRed
                )
            }
        ) {
            val activeColor = Color(0xFF10B981)
            val pendingColor = Color(0xFFF59E0B)

            Tab(
                selected = selectedStatusTab == 0,
                onClick = { selectedStatusTab = 0 },
                text = { Text("Active (${venues.count { it.status == "ACTIVE" }})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                selectedContentColor = activeColor,
                unselectedContentColor = Color.Gray
            )
            Tab(
                selected = selectedStatusTab == 1,
                onClick = { selectedStatusTab = 1 },
                text = { Text("Pending (${venues.count { it.status == "PENDING" }})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                selectedContentColor = pendingColor,
                unselectedContentColor = Color.Gray
            )
            Tab(
                selected = selectedStatusTab == 2,
                onClick = { selectedStatusTab = 2 },
                text = { Text("Rejected (${venues.count { it.status == "REJECTED" }})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                selectedContentColor = brandRed,
                unselectedContentColor = Color.Gray
            )
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            if (filteredVenues.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 40.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(32.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = when (selectedStatusTab) {
                                    0 -> "No Active Venues"
                                    1 -> "No Pending Applications"
                                    else -> "No Rejected Venues"
                                },
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandDarkText
                            )
                            Text(
                                text = when (selectedStatusTab) {
                                    0 -> "Your approved venues open for bookings will appear here."
                                    1 -> "Properties currently awaiting verification from the admin team."
                                    else -> "Venues requiring descriptive adjustments before approval."
                                },
                                fontSize = 13.sp,
                                color = Color.Gray,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            } else {
                items(filteredVenues) { venue ->
                    val statusBorderColor = when (venue.status) {
                        "ACTIVE" -> Color(0xFF10B981).copy(alpha = 0.4f)
                        "PENDING" -> Color(0xFFF59E0B).copy(alpha = 0.4f)
                        else -> brandRed.copy(alpha = 0.4f)
                    }

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(width = 1.dp, color = statusBorderColor, shape = RoundedCornerShape(14.dp))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(text = venue.name, fontSize = 16.sp, color = brandDarkText, fontWeight = FontWeight.Bold)
                                }

                                if (venue.status == "ACTIVE") {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Text(
                                            text = if (venue.isListed) "Listed" else "Hidden",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = if (venue.isListed) Color(0xFF10B981) else Color.Gray
                                        )
                                        Box(modifier = Modifier.scale(0.8f)) {
                                            Switch(
                                                checked = venue.isListed,
                                                onCheckedChange = { onToggleListing(venue.id, venue.isListed) },
                                                colors = SwitchDefaults.colors(
                                                    checkedThumbColor = Color.White,
                                                    checkedTrackColor = Color(0xFF10B981),
                                                    uncheckedThumbColor = Color.White,
                                                    uncheckedTrackColor = Color.LightGray
                                                )
                                            )
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            HorizontalDivider(color = Color.LightGray.copy(alpha = 0.3f))
                            Spacer(modifier = Modifier.height(8.dp))

                            Text(text = "Category: ${venue.category}", fontSize = 13.sp, color = Color.DarkGray, fontWeight = FontWeight.Medium)
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(text = "Location: ${venue.location}", fontSize = 13.sp, color = Color.Gray)
                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "₹${venue.pricePerHour} / hour",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandRed
                            )

                            if (venue.status == "REJECTED" && venue.rejectReason != null) {
                                Spacer(modifier = Modifier.height(12.dp))
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(brandRed.copy(alpha = 0.04f), RoundedCornerShape(8.dp))
                                        .border(0.5.dp, brandRed.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                        .padding(12.dp)
                                ) {
                                    Text(text = "Reason for Rejection:", fontSize = 12.sp, color = brandRed, fontWeight = FontWeight.Bold)
                                    Text(text = venue.rejectReason, fontSize = 13.sp, color = brandDarkText)

                                    Spacer(modifier = Modifier.height(10.dp))
                                    Button(
                                        onClick = { },
                                        colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.fillMaxWidth().height(36.dp)
                                    ) {
                                        Text("Fix Details & Resubmit", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun AddVenueTab(
    viewModel: OwnerDashboardViewModel,
    brandRed: Color,
    brandDarkText: Color,
    categories: List<String>,
    onFormSuccessNavigation: () -> Unit
) {
    val context = LocalContext.current
    var name by remember { mutableStateOf("") }
    var showMapPicker by remember { mutableStateOf(false) }
    var chosenCoordinates by remember { mutableStateOf<LatLng?>(null) }
    var locationTextDisplay by remember { mutableStateOf("No location selected") }
    var addressInput by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var capacity by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Select Category") }
    var dropdownExpanded by remember { mutableStateOf(false) }
    var isSubmitting by remember { mutableStateOf(false) }

    val amenityOptions = remember {
        listOf("WiFi 📶", "Air Conditioning ❄️", "Sound System 🔊", "Parking 🚗", "Catering 🍽️", "Power Backup ⚡")
    }
    val selectedAmenities = remember { mutableStateListOf<String>() }
    val scrollState = rememberScrollState()

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            if (viewModel.uploadedImageUrls.size >= 6) {
                Toast.makeText(context, "Exactly 6 photos are required.", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.uploadVenueImage(context, uri)
            }
        }
    }

    val mandRed = Color(0xFFE51E26)
    fun mandatoryLabel(text: String) = buildAnnotatedString {
        append(text)
        withStyle(style = SpanStyle(color = mandRed, fontWeight = FontWeight.Bold)) {
            append(" *")
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Register New Venue", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1A1A))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text(text = mandatoryLabel("Venue Name")) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            singleLine = true
        )

        OutlinedCard(
            onClick = { showMapPicker = true },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = CardDefaults.outlinedCardColors(containerColor = Color.White),
            border = borderStroke(width = 1.dp, color = Color.LightGray)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = mandatoryLabel("Venue Location Setup"),
                        fontSize = 12.sp,
                        color = Color.DarkGray
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = locationTextDisplay,
                        style = MaterialTheme.typography.bodyLarge,
                        fontSize = 14.sp,
                        color = if (chosenCoordinates != null) brandDarkText else Color.Gray
                    )
                }
                Text(
                    text = "Select Map 📍",
                    color = brandRed,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        OutlinedTextField(
            value = addressInput,
            onValueChange = { addressInput = it },
            label = { Text(text = mandatoryLabel("Detailed Address (Building, Street, Landmark)")) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        )

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(
                value = price,
                onValueChange = { price = it },
                label = { Text(text = mandatoryLabel("Price / Hr")) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )
            OutlinedTextField(
                value = capacity,
                onValueChange = { capacity = it },
                label = { Text(text = mandatoryLabel("Max Capacity")) },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
            )
        }

        ExposedDropdownMenuBox(
            expanded = dropdownExpanded,
            onExpandedChange = { dropdownExpanded = !dropdownExpanded },
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = selectedCategory,
                onValueChange = {},
                readOnly = true,
                label = { Text(text = mandatoryLabel("Venue Category")) },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                modifier = Modifier.fillMaxWidth().menuAnchor(),
                shape = RoundedCornerShape(8.dp)
            )

            ExposedDropdownMenu(
                expanded = dropdownExpanded,
                onDismissRequest = { dropdownExpanded = false }
            ) {
                if (categories.isEmpty() || (categories.size == 1 && categories.first() == "All")) {
                    DropdownMenuItem(
                        text = { Text("No categories configured by admin", color = Color.Gray) },
                        onClick = {},
                        enabled = false
                    )
                } else {
                    categories.filter { it != "All" }.forEach { category ->
                        DropdownMenuItem(
                            text = { Text(text = category) },
                            onClick = {
                                selectedCategory = category
                                dropdownExpanded = false
                            }
                        )
                    }
                }
            }
        }

        OutlinedTextField(
            value = description,
            onValueChange = { description = it },
            label = { Text(text = mandatoryLabel("Venue Description Details")) },
            modifier = Modifier.fillMaxWidth().height(100.dp),
            shape = RoundedCornerShape(8.dp)
        )

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text = mandatoryLabel("Venue Amenities"), fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                amenityOptions.forEach { amenity ->
                    val isSelected = selectedAmenities.contains(amenity)
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            if (isSelected) selectedAmenities.remove(amenity) else selectedAmenities.add(amenity)
                        },
                        label = { Text(amenity, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = brandRed,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        }

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = buildAnnotatedString {
                        append("Venue Photos ")
                        withStyle(style = SpanStyle(color = brandRed, fontWeight = FontWeight.Bold)) {
                            append("(Exactly 6 Required) *")
                        }
                    },
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = brandDarkText
                )
                Text(
                    text = "${viewModel.uploadedImageUrls.size} / 6",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (viewModel.uploadedImageUrls.size == 6) Color(0xFF10B981) else Color.Gray
                )
            }

            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp)
                    .background(Color.White, RoundedCornerShape(8.dp))
                    .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
                    .padding(10.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (viewModel.uploadedImageUrls.size < 6) {
                    item {
                        Box(
                            modifier = Modifier
                                .size(90.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFFF8FAFC))
                                .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
                                .clickable { galleryLauncher.launch("image/*") },
                            contentAlignment = Alignment.Center
                        ) {
                            if (viewModel.isUploadingImage) {
                                CircularProgressIndicator(color = brandRed, modifier = Modifier.size(24.dp), strokeWidth = 2.5.dp)
                            } else {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(24.dp))
                                    Text("Add", fontSize = 11.sp, color = Color.Gray)
                                }
                            }
                        }
                    }
                }

                items(viewModel.uploadedImageUrls) { url ->
                    Box(modifier = Modifier.size(90.dp)) {
                        AsyncImage(
                            model = url,
                            contentDescription = null,
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(RoundedCornerShape(8.dp)),
                            contentScale = ContentScale.Crop
                        )
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(4.dp)
                                .size(20.dp)
                                .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                                .clickable { viewModel.removeUploadedImage(url) },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Close, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                        }
                    }
                }
            }

            viewModel.imageUploadError?.let { error ->
                Text(text = error, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(2.dp))
        Button(
            onClick = {
                val doublePrice = price.toDoubleOrNull()
                val intCapacity = capacity.toIntOrNull()

                if (name.isBlank() || chosenCoordinates == null || doublePrice == null || intCapacity == null ||
                    description.isBlank() || selectedCategory == "Select Category" || addressInput.isBlank()) {
                    Toast.makeText(context, "All fields are mandatory!", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                if (viewModel.uploadedImageUrls.size != 6) {
                    Toast.makeText(context, "You must upload exactly 6 photos to submit!", Toast.LENGTH_LONG).show()
                    return@Button
                }

                isSubmitting = true
                viewModel.submitVenue(
                    name = name,
                    location = locationTextDisplay,
                    address = addressInput,
                    price = doublePrice,
                    capacity = intCapacity,
                    description = description,
                    category = selectedCategory,
                    amenities = selectedAmenities.toList(),
                    onSuccess = {
                        isSubmitting = false
                        onFormSuccessNavigation()
                    },
                    onError = { message ->
                        isSubmitting = false
                        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
                    }
                )
            },
            enabled = !isSubmitting && !viewModel.isUploadingImage,
            modifier = Modifier.fillMaxWidth().height(46.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = brandRed)
        ) {
            if (isSubmitting) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White, strokeWidth = 2.5.dp)
            } else {
                Text("Submit Property For Verification", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
        }
    }

    if (showMapPicker) {
        MapLocationPickerScale(
            onLocationConfirmed = { coordinates ->
                chosenCoordinates = coordinates
                val geocoder = Geocoder(context, Locale.getDefault())
                try {
                    val addresses = geocoder.getFromLocation(coordinates.latitude, coordinates.longitude, 1)
                    if (!addresses.isNullOrEmpty()) {
                        val fetchedAddress = addresses[0].getAddressLine(0)
                        if (!fetchedAddress.isNullOrBlank()) {
                            locationTextDisplay = fetchedAddress
                        } else {
                            locationTextDisplay = "${coordinates.latitude}, ${coordinates.longitude}"
                        }
                    } else {
                        locationTextDisplay = "${coordinates.latitude}, ${coordinates.longitude}"
                    }
                } catch (e: Exception) {
                    locationTextDisplay = "${coordinates.latitude}, ${coordinates.longitude}"
                }
                showMapPicker = false
            },
            onDismiss = { showMapPicker = false }
        )
    }
}

@Composable
private fun borderStroke(width: androidx.compose.ui.unit.Dp, color: Color) =
    androidx.compose.foundation.BorderStroke(width, color)

@Composable
fun OwnerBookingsTab(brandDarkText: Color) {
    Box(modifier = Modifier.fillMaxSize().padding(16.dp), contentAlignment = Alignment.Center) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text("Incoming Reservations", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                Text(
                    text = "Approved tracking metrics will appear here.",
                    fontSize = 13.sp,
                    color = Color.Gray,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun OwnerProfileTab(
    userName: String,
    onLogoutClick: () -> Unit,
    brandRed: Color,
    brandDarkText: Color
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.TopCenter
    ) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .background(Color(0xFFF0F2F5), CircleShape)
                        .border(1.dp, Color.LightGray.copy(alpha = 0.5f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = userName.take(1).uppercase(),
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandDarkText
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
                Text(text = userName, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = brandDarkText)

                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color(0xFFEAEDF1),
                    modifier = Modifier.padding(top = 40.dp)
                ) {
                    Text(
                        text = "OWNER ACCOUNT",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.DarkGray,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        letterSpacing = 1.sp
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))
                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))
                Spacer(modifier = Modifier.height(24.dp))

                OutlinedButton(
                    onClick = onLogoutClick,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = brandRed),
                    border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.2.dp)
                ) {
                    Icon(imageVector = Icons.Default.ExitToApp, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Secure Logout", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}