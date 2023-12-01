import Link from "next/link";
import { Card, Image, CardBody, Heading, Center, Box } from "@chakra-ui/react";
import { UrlObject } from "url";

type RouteButtonProps = {
  route: string;
  text: string;
  color: string;
  imageUrl: string;
};

export const RouteButton = ({
  route,
  text,
  color,
  imageUrl,
}: RouteButtonProps) => {
  let hoverState = {
    bg: color,
  };
  return (
    <Center>
      <Link href={route}>
        <Card
          maxW="sm"
          border="1px"
          borderColor={color}
          borderRadius="20px"
          width="20vw"
          _hover={hoverState}
        >
          <CardBody>
            <Center>
              <Heading size="md">{text}</Heading>
            </Center>
            <Center>
              <Image
                src={imageUrl}
                borderRadius="lg"
                height="20vh"
                alt="button"
              />
            </Center>
          </CardBody>
        </Card>
      </Link>
    </Center>
  );
};
