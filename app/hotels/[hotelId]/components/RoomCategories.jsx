"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoomCategories } from "../queryFunctions";
import { toValidSelector } from "@/lib/string-parsers";
import { selectedRoomCategory$ } from "./RoomTypes";

const RoomCategories = () => {
  const setSelectedCategory = selectedRoomCategory$.set;
  const { data: roomCategories = [], isLoading } = useQuery({
    queryKey: ["roomCategories"],
    queryFn: async () => getRoomCategories(),
    select: (data) => data?.hotel_listing_roomCategories,
  });

  /* const filteredRooms =
    selectedCategory === "all"
      ? roomCategories
      : roomCategories.filter((room) => room.categoryId === selectedCategory); */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <Tabs
        defaultValue="all"
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <TabsList className="bg-transparent px-0 gap-1">
          <Trigger value="all" name="All" />
          {roomCategories?.map((roomCategory) => (
            <Trigger
              key={roomCategory.categoryId}
              value={roomCategory.categoryId}
              name={roomCategory.name}
            />
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RoomCategories;

const Trigger = ({ value, name }) => (
  <TabsTrigger
    value={toValidSelector(value)}
    className="border rounded-full px-4 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
  >
    {name}
  </TabsTrigger>
);
