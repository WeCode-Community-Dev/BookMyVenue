for testing in swagger  
i already enabled spring security so add below urls in security filter in Auth/securitycondig file 
in permit all pipline

/swagger-ui/**,
/v3/api-docs/**,
/swagger-ui.html


--- some user credentials
{
"email": "owner1@gmail.com",
"password": "pass@123"
}


---some owner credentials


{
"email": "owner@bookmyvenue.com",
"password":"owner123"
}

{
"email": "owner@bookmyvenue.com",
"password":"owner123"
}



        private Integer maxAdvanceBookingDays;
