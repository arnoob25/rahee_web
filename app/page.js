"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>GoRahee</h1>
      <Link href={"/hotels"}>hotels</Link>
    </div>
  );
}
