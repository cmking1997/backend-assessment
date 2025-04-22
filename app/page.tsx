'use client'

import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// A landing / loading page which will likely just flash for a moment
// If main page load times increase in future this will be what shows instead of a blank page
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/mainPage");
  }, []);

  return (
    <Flex
      height={'100vh'} // set height to full view height
      backgroundColor={'#222222'} // set background to a medium grey
    >
      Welcome to balance check, page is loading.
    </Flex>
  );
}
