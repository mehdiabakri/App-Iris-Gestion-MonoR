<?php

namespace App\Service;

use Cloudinary\Cloudinary;

class CloudinaryFactory
{
    private string $cloudinaryUrl;

    public function __construct(string $cloudinaryUrl)
    {
        $this->cloudinaryUrl = $cloudinaryUrl;
    }

    public function createCloudinary(): Cloudinary
    {
        return new Cloudinary($this->cloudinaryUrl);
    }
}