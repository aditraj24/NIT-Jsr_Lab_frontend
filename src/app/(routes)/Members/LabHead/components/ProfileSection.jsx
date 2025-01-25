"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import InfoTabs from "./InfoTabs";
import { getFileURL } from "@/utils/functions";

const ProfilePage = () => {
  const [people, setPeople] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nitjsr.ac.in/backend/api/people/faculty?id=CS103`
        );
        const data = await response.json();
        setPeople(data[0] || {});
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  return (
    <div className="p-5 bg-white/80 backdrop-blur-md rounded-lg shadow-lg max-w-4xl mx-auto my-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-xl text-sky-900">Loading Profile...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            <div className="relative w-40 h-40 group">
            <Image
                src={getFileURL(people.profile)}
                alt={`${people.fname} ${people.lname}'s profile picture`}
                layout="fill"
                className="rounded-full object-left-top object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                onClick={togglePreview}
              >
                <FaEye className="text-white text-2xl" />
                <span className="text-white ml-2">Preview</span>
              </div>
            </div>

            <h1 className="mt-8 mb-6 text-3xl font-bold text-sky-900">
              {people.fname} {people.lname}
            </h1>

            <div className="px-4">
              <p
                dangerouslySetInnerHTML={{ __html: people.bio }}
                className="mt-2 text-gray-600 text-lg leading-relaxed"
              ></p>
            </div>
          </div>

          <InfoTabs />

          {isPreviewVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
              <div className="relative bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-6">
                <button
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                  onClick={togglePreview}
                >
                  &times;
                </button>
                <Image
                  src={getFileURL(people.profile)}
                  alt="Image preview"
                  width={400}
                  height={400}
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;