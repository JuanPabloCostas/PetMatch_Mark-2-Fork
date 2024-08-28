import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

interface NewsCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  bodyText: string;
  linkUrl: string;
  linkText: string;
}

export default function NewsCard({
  imageUrl,
  title,
  subtitle,
  bodyText,
  linkUrl,
  linkText
}: NewsCardProps) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt={title}
          height={40}
          radius="sm"
          src={imageUrl}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
          <p className="text-small text-default-500">{subtitle}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{bodyText}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={linkUrl}>
          {linkText}
        </Link>
      </CardFooter>
    </Card>
  );
}
