import Link from "next/link";
import { Box, styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <Link href="/" passHref>
      <Box
        component="div"
        sx={{
          width: 100,  // Adjust width as needed
          height: 100, // Adjust height as needed
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src="/images/logos/logo.png"
          alt="logo"
          width={400} // Define a fixed width to ensure the image scales appropriately.
          height={130} // Maintain the aspect ratio by setting height.
          priority
          // style={{ width: 'auto', height: 'auto' }}
        />
      </Box>
    </Link>
  );
};

export default Logo;
  