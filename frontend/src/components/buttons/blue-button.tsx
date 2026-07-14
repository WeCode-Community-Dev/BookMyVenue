import { Link } from "react-router-dom";

import { Button } from "@mui/material";

import { Iconify } from "../iconify";

type ButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    href?: string
    label: string
}

export function BlueButton({ href, onClick, label }: ButtonProps) {

    if (href) {

        return (
            <Link to={href}>
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mdi:plus" />}
                    onClick={onClick}
                    sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    }}
                >
                    {label}
                </Button>
            </Link>
        )
    }

    return (
        <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={onClick}
            sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
            }}
        >
            Add Venue
        </Button>
    )
}