// Image Preloader Script - FIXED VERSION
class ImageLoader {
  constructor(loaderElementId = 'loader-container') {
    this.loaderElement = document.getElementById(loaderElementId);
    this.imageCount = 0;
    this.loadedImages = 0;
    this.timeout = 10000; // 10 second timeout to prevent infinite loader
  }

  // Initialize loader - call this when page starts
  init() {
    this.showLoader();
    this.startLoadingImages();
    
    // IMPORTANT: Set a timeout to hide loader even if images don't fully load
    setTimeout(() => {
      if (!this.loaderElement.classList.contains('hidden')) {
        console.warn('Loader timeout - hiding loader');
        this.hideLoader();
      }
    }, this.timeout);
  }

  // Start loading images
  startLoadingImages() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.countAndLoadImages());
    } else {
      this.countAndLoadImages();
    }
  }

  // Count and attach listeners to all images
  countAndLoadImages() {
    const images = document.querySelectorAll('img');
    this.imageCount = images.length;

    console.log('Total images found:', this.imageCount);

    if (this.imageCount === 0) {
      console.log('No images found, hiding loader immediately');
      this.hideLoader();
      return;
    }

    // Add load event listeners to all images
    images.forEach((img, index) => {
      // If image is already cached/loaded
      if (img.complete) {
        console.log('Image already loaded:', img.src);
        this.onImageLoad();
      } else {
        // Add listeners for loading
        img.addEventListener('load', () => {
          console.log('Image loaded:', img.src);
          this.onImageLoad();
        });
        
        img.addEventListener('error', () => {
          console.warn('Image failed to load:', img.src);
          this.onImageLoad(); // Still count failed images
        });
      }
    });
  }

  // Called when an image loads
  onImageLoad() {
    this.loadedImages++;
    const progress = (this.loadedImages / this.imageCount) * 100;
    this.updateProgress(progress);

    console.log(`Images loaded: ${this.loadedImages}/${this.imageCount}`);

    // Hide loader when all images are loaded
    if (this.loadedImages === this.imageCount) {
      console.log('All images loaded!');
      this.hideLoader();
    }
  }

  // Update progress bar (optional)
  updateProgress(progress) {
    const progressBar = document.getElementById('loader-progress');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    if (progressText) {
      progressText.textContent = Math.round(progress) + '%';
    }
  }

  // Show the loader
  showLoader() {
    if (this.loaderElement) {
      this.loaderElement.classList.remove('hidden');
      this.loaderElement.style.display = 'flex';
    }
  }

  // Hide the loader
  hideLoader() {
    if (this.loaderElement) {
      this.loaderElement.classList.add('hidden');
      
      // Fade out and remove from display
      setTimeout(() => {
        if (this.loaderElement) {
          this.loaderElement.style.display = 'none';
        }
      }, 500);
    }
  }
}

// Initialize loader immediately on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing loader...');
  const loader = new ImageLoader('loader-container');
  loader.init();
});