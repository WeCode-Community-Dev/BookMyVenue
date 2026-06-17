import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@mui/lab";
import {
    Box,
    Card,
    Grid,
    Stack,
    MenuItem,
    TextField,
    CardHeader,
    Typography,
    CardContent,
} from "@mui/material";

import { AdminApiService } from "src/api/admin";
import { UserRole } from "src/api/types/auth.type";


const schema = z.object({
    email: z.email(),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters"),

    firstName: z
        .string()
        .min(1, "First name is required"),

    lastName: z.string().optional(),

    phone: z.string().optional(),

    role: z.enum([
        UserRole.USER,
        UserRole.VENUE_OWNER,
    ]),
});

export type CreateUserFormValues = z.infer<
    typeof schema
>;

export function CreateUserForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(schema),

        defaultValues: {
            role: UserRole.USER,
        },
    });

    const { isPending, mutateAsync } = useMutation({
        mutationFn: (
            data: CreateUserFormValues
        ) => AdminApiService.createUser(data),
    });

    const onSubmit = async (
        data: CreateUserFormValues
    ) => {
        await mutateAsync(data);

        reset();
    };

    return (
        <Stack spacing={3} padding={3}>
            <Box>
                <Typography variant="h4">
                    Create User
                </Typography>
            </Box>
            <Card>
                <CardHeader
                    title="User Information"
                />
                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                    >
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    {...register(
                                        "firstName"
                                    )}
                                    error={
                                        !!errors.firstName
                                    }
                                    helperText={
                                        errors.firstName
                                            ?.message
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    {...register(
                                        "lastName"
                                    )}
                                    error={
                                        !!errors.lastName
                                    }
                                    helperText={
                                        errors.lastName
                                            ?.message
                                    }
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    {...register(
                                        "email"
                                    )}
                                    error={
                                        !!errors.email
                                    }
                                    helperText={
                                        errors.email
                                            ?.message
                                    }
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Phone"
                                    fullWidth
                                    {...register(
                                        "phone"
                                    )}
                                    error={
                                        !!errors.phone
                                    }
                                    helperText={
                                        errors.phone
                                            ?.message
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    {...register(
                                        "password"
                                    )}
                                    error={
                                        !!errors.password
                                    }
                                    helperText={
                                        errors.password
                                            ?.message
                                    }
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <TextField
                                    select
                                    fullWidth
                                    label="Role"
                                    defaultValue={
                                        UserRole.USER
                                    }
                                    {...register(
                                        "role"
                                    )}
                                    error={
                                        !!errors.role
                                    }
                                    helperText={
                                        errors.role
                                            ?.message
                                    }
                                >
                                    <MenuItem
                                        value={
                                            UserRole.USER
                                        }
                                    >
                                        User
                                    </MenuItem>

                                    <MenuItem
                                        value={
                                            UserRole.VENUE_OWNER
                                        }
                                    >
                                        Venue Owner
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                >
                                    <LoadingButton
                                        // color="info"
                                        type="submit"
                                        variant="contained"
                                        loading={
                                            isPending
                                        }
                                        size="large"
                                    >
                                        Create User
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    );
}