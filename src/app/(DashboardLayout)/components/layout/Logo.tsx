import Link from "next/link";
import { Box, styled } from "@mui/material";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" passHref>
      <Box
        component="div"
        sx={{
          width: 100,
          height: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src="/images/logos/smallLogo.png"
          alt="logo"
          width={400}
          height={130}
          priority
        />
      </Box>
    </Link>
  );
};

export default Logo;
