"use client";

import { Plus, Upload } from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import NextImage from "next/image";
import { PhotoUploadProps } from "@/types/AddVenue";
import { useLanguage } from "@/store/AppConfigReducer";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

const txt = (textName: string) => {
    return AppText({ textName, textModule: "PHOTOS" }); 
};

export default function PhotoUpload({ files, setFiles }: PhotoUploadProps) {
    // Re-render on language change
    useSelector(useLanguage);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleZoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.files) {
            const newFiles = Array.from(evt.target.files);
            setFiles([
                ...files, ...newFiles
            ]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_file, idx) => {
            return idx !== index; 
        }));
    };

    const primaryFile = files[ 0 ];
    const secondaryFiles = files.slice(1);

    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <Upload className={venueStyle.headerIcon} />

                <h2 className={venueStyle.headerTitle}>
                    {txt("HEADING")}
                </h2>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
            />

            <div className={venueStyle.photoGrid}>
                {/* Cover Image */}
                {primaryFile
                    ? (
                        <div className={venueStyle.coverPreview}>
                            <NextImage
                                src={URL.createObjectURL(primaryFile)}
                                alt={txt("COVER_BADGE")}
                                fill
                                unoptimized
                                className={venueStyle.coverImg}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    return handleRemoveFile(0); 
                                }}
                                className={venueStyle.coverRemoveBtn}
                            >
                                {txt("REMOVE")}
                            </button>
                            <span className={venueStyle.coverBadge}>
                                {txt("COVER_BADGE")}
                            </span>
                        </div>
                    )
                    : (
                        <div
                            onClick={handleZoneClick}
                            className={venueStyle.uploadZone}
                        >
                            <Upload className={venueStyle.uploadIcon} />

                            <p className={venueStyle.uploadText}>
                                {txt("UPLOAD_COVER")}
                            </p>

                            <p className={venueStyle.uploadSubtext}>
                                {txt("COVER_REC")}
                            </p>
                        </div>
                    )}

                {/* Gallery Images */}
                <div>
                    <p className={venueStyle.galleryLabel}>
                        {txt("ADDITIONAL")}
                    </p>

                    <div className={venueStyle.galleryGrid}>
                        {secondaryFiles.map((file, idx) => {
                            const actualIndex = idx + 1;
                            return (
                                <div
                                    key={idx}
                                    className={venueStyle.galleryThumb}
                                >
                                    <NextImage
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${actualIndex}`}
                                        fill
                                        unoptimized
                                        className={venueStyle.galleryThumbImg}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            return handleRemoveFile(actualIndex); 
                                        }}
                                        className={venueStyle.galleryRemoveBtn}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}

                        {files.length < 10 && (
                            <button
                                type="button"
                                onClick={handleZoneClick}
                                className={venueStyle.galleryAddButton}
                            >
                                <Plus className={venueStyle.galleryAddIcon} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Upload Hint */}
                <p className={venueStyle.uploadSubtext}>
                    {txt("UPLOAD_HINT")}
                </p>
            </div>
        </div>
    );
}
