package com.example.bookmyvenue.ui_layout
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExpandedProfileLayout(
    isLoggedIn: Boolean,
    userName: String,
    userEmail: String,
    role: String,
    onLogoutClick: () -> Unit,
    onNavigateToLogin: () -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: (() -> Unit)? = null,
    onMyBookingsClick: (() -> Unit)? = null,
    onPaymentHistoryClick: (() -> Unit)? = null,
    statCountOne: Int = 0,
    statAmountTwo: Double = 0.0,
    statCountThree: Int = 0,
    ownerVenuesList: List<OwnerVenueItem> = emptyList()
) {
    val brandRed = Color(0xFFE51E26)
    val brandDarkText = Color(0xFF1A1A1A)
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            if (onBackClick != null) {
                CenterAlignedTopAppBar(
                    title = { Text("My Profile", fontSize = 18.sp, fontWeight = FontWeight.Bold) },
                    navigationIcon = {
                        IconButton(onClick = onBackClick) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Back Navigation",
                                tint = brandDarkText
                            )
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = Color.White,
                        titleContentColor = brandDarkText
                    )
                )
            }
        },
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFFF6F8FA))
        ) {
            if (!isLoggedIn) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "My Profile",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandDarkText
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Log in to view your profile details, bookings history, and payment transactions.",
                        fontSize = 14.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center,
                        lineHeight = 20.sp
                    )
                    Spacer(modifier = Modifier.height(28.dp))
                    Button(
                        onClick = onNavigateToLogin,
                        colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                    ) {
                        Text("Login or Sign Up", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    }
                }
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(scrollState)
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .background(Color(0xFFE2E8F0), CircleShape)
                                .border(1.dp, Color.LightGray.copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = userName.take(1).uppercase(),
                                fontSize = 32.sp,
                                fontWeight = FontWeight.Bold,
                                color = brandDarkText
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(text = userName, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                        Text(text = if (userEmail.isNotBlank()) userEmail else "No Email Provided", fontSize = 14.sp, color = Color.Gray)

                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = when (role.uppercase()) {
                                "ADMIN" -> Color(0xFFFCE8E6)
                                "OWNER" -> Color(0xFFFEF3C7)
                                else -> Color(0xFFE6F4EA)
                            },
                            modifier = Modifier.padding(top = 10.dp)
                        ) {
                            Text(
                                text = when (role.uppercase()) {
                                    "ADMIN" -> "Admin Account"
                                    "OWNER" -> "Owner Account"
                                    else -> "Customer Account"
                                },
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = when (role.uppercase()) {
                                    "ADMIN" -> brandRed
                                    "OWNER" -> Color(0xFFB45309)
                                    else -> Color(0xFF137333)
                                },
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }

                    HorizontalDivider(color = Color.LightGray.copy(alpha = 0.4f))

                    Text(
                        text = "Account Summary",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = brandDarkText,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        when (role.uppercase()) {
                            "ADMIN" -> {
                                ProfileSummaryMetricCard(title = "Total Venues", value = "$statCountOne", modifier = Modifier.weight(1f))
                                ProfileSummaryMetricCard(title = "Total Revenue", value = "₹$statAmountTwo", modifier = Modifier.weight(1f))
                            }
                            "OWNER" -> {
                                ProfileSummaryMetricCard(title = "My Venues", value = "$statCountOne", modifier = Modifier.weight(1f))
                                ProfileSummaryMetricCard(title = "Total Revenue", value = "₹$statAmountTwo", modifier = Modifier.weight(1f))
                            }
                            else -> {
                                ProfileSummaryMetricCard(title = "Total Bookings", value = "$statCountOne", modifier = Modifier.weight(1f))
                                ProfileSummaryMetricCard(title = "Total Spent", value = "₹$statAmountTwo", modifier = Modifier.weight(1f))
                            }
                        }
                    }

                    when (role.uppercase()) {
                        "USER" -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Text(text = "History", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                if (onMyBookingsClick != null) {
                                    CoreProfileNavigationRow(icon = Icons.Default.DateRange, label = "My Bookings", onClick = onMyBookingsClick, brandRed = brandRed, brandDarkText = brandDarkText)
                                }
                                if (onPaymentHistoryClick != null) {
                                    CoreProfileNavigationRow(icon = Icons.Default.DateRange, label = "Payment History", onClick = onPaymentHistoryClick, brandRed = brandRed, brandDarkText = brandDarkText)
                                }
                            }
                        }
                        "OWNER" -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Text(text = "My Approved Venues", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                val approvedVenues = ownerVenuesList.filter { it.status == "ACTIVE" }
                                if (approvedVenues.isEmpty()) {
                                    Card(
                                        colors = CardDefaults.cardColors(containerColor = Color.White),
                                        shape = RoundedCornerShape(12.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Text(
                                            text = "No active approved venues found.",
                                            color = Color.Gray,
                                            fontSize = 13.sp,
                                            modifier = Modifier.padding(24.dp),
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                } else {
                                    approvedVenues.forEach { venue ->
                                        Card(
                                            colors = CardDefaults.cardColors(containerColor = Color.White),
                                            shape = RoundedCornerShape(10.dp),
                                            border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .padding(14.dp),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Column(
                                                    modifier = Modifier
                                                        .weight(1f)
                                                        .padding(end = 8.dp)
                                                ) {
                                                    Text(
                                                        text = venue.name,
                                                        fontWeight = FontWeight.Bold,
                                                        fontSize = 14.sp,
                                                        color = brandDarkText,
                                                        maxLines = 1,
                                                        overflow = TextOverflow.Ellipsis
                                                    )
                                                    Spacer(modifier = Modifier.height(2.dp))
                                                    Text(
                                                        text = "Category: ${venue.category}",
                                                        fontSize = 12.sp,
                                                        color = Color.Gray
                                                    )
                                                }
                                                Surface(
                                                    shape = RoundedCornerShape(4.dp),
                                                    color = if (venue.isListed) Color(0xFFE6F4EA) else Color(0xFFF1F5F9)
                                                ) {
                                                    Text(
                                                        text = if (venue.isListed) "Listed" else "Hidden",
                                                        fontSize = 10.sp,
                                                        fontWeight = FontWeight.Bold,
                                                        color = if (venue.isListed) Color(0xFF137333) else Color.Gray,
                                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        "ADMIN" -> {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Text(text = "Pending Actions", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = brandDarkText)
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = Color.White),
                                    shape = RoundedCornerShape(12.dp),
                                    border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.5f)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(
                                        modifier = Modifier.padding(16.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column {
                                            Text(text = "Pending Venue Approvals", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = brandDarkText)
                                            Text(text = "Venues awaiting verification checks", fontSize = 12.sp, color = Color.Gray)
                                        }
                                        Surface(
                                            shape = RoundedCornerShape(20.dp),
                                            color = if (statCountThree > 0) brandRed else Color(0xFF10B981)
                                        ) {
                                            Text(
                                                text = "$statCountThree Pending",
                                                color = Color.White,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    OutlinedButton(
                        onClick = onLogoutClick,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = brandRed),
                        border = BorderStroke(1.2.dp, brandRed)
                    ) {
                        Icon(imageVector = Icons.Default.ExitToApp, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Logout", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileSummaryMetricCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = title, fontSize = 11.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = value, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1A1A1A))
        }
    }
}

@Composable
fun CoreProfileNavigationRow(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit,
    brandRed: Color,
    brandDarkText: Color
) {
    Card(
        onClick = onClick,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(0.5.dp, Color.LightGray.copy(alpha = 0.4f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = brandRed, modifier = Modifier.size(22.dp))
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = brandDarkText,
                modifier = Modifier.weight(1f)
            )
            Text(text = "→", color = Color.Gray, fontSize = 16.sp)
        }
    }
}