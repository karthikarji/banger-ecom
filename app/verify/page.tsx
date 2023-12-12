"use client";

import { notFound, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  searchParams: { token: string; userId: string };
}

export default function Verify(props: Props) {
  const { token, userId } = props.searchParams;
  const router = useRouter();

  if (!token || !userId) {
    return notFound();
  }

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const response = await res.json();
      const { error, message } = response as { message: string; error: string };

      if (res.ok) {
        router.replace("/");
        toast.success(message);
      }
      if (!res.ok && error) {
        console.log(error);
        toast.error(error);
      }
    });
  }, []);

  return (
    <div className="text-3xl opacity-70 text-center p-5 animate-pulse">
      Please wait...
      <p>We are verifying your email</p>
    </div>
  );
}
