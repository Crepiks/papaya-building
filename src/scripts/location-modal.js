export const initializeLocationModal = () => {
  const locationModal = document.getElementById("location-modal");
  const locationModalCloseButton = document.getElementById(
    "location-modal-close-button"
  );

  locationModalCloseButton.addEventListener("click", () => {
    locationModal.style.display = "none";
  });
};

export const openLocationModal = () => {
  const locationModal = document.getElementById("location-modal");
  locationModal.style.display = "flex";
};
