import { useState, useEffect } from "react"
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin"
import {
  FaWifi,
  FaTv,
  FaCoffee,
  FaBath,
  FaShower,
  FaWineGlassAlt,
  FaDoorOpen,
  FaBed,
  FaClock,
  FaCheck,
  FaTimes,
  FaSmokingBan,
  FaDog,
  FaPlus,
} from "react-icons/fa";

import {
  FiPlus,
  FiMinus,
  FiCheck,
  FiX,
  FiImage,
  FiEdit,
  FiTrash2,
  FiPlusCircle
} from "react-icons/fi";

// Constants defined inside the component
const AMENITY_OPTIONS = [
  { icon: <FaWifi />, name: "High-speed Wi-Fi" },
  { icon: <FaTv />, name: "Smart TV with streaming" },
  { icon: <FaCoffee />, name: "Coffee machine" },
  { icon: <FaShower />, name: "Rainfall shower" },
  { icon: <FaWineGlassAlt />, name: "Minibar" },
  { icon: <FaDoorOpen />, name: "Room service" },
  { icon: <FaBath />, name: "Luxury bathroom" },
  { icon: <FaBed />, name: "Premium bedding" },
]

const FEATURE_OPTIONS = [
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Complimentary Wi-Fi" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "48-inch Smart TV" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Minibar" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Coffee machine" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Air conditioning" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Room service" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Safe" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Bathrobe & slippers" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Premium toiletries" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Work desk" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Blackout curtains" },
  { icon: <FaCheck style={{ color: "#d0b375" }} />, name: "Daily housekeeping" },
];

const POLICY_OPTIONS = [
  { icon: <FaClock />, name: "Check-in: 3:00 PM" },
  { icon: <FaClock />, name: "Check-out: 12:00 PM" },
  { icon: <FaClock />, name: "Cancellation: Free up to 48 hours before arrival" },
  { icon: <FaSmokingBan />, name: "No smoking" },
  { icon: <FaDog />, name: "No pets allowed" },
  { icon: <FaBed />, name: "Extra bed: $30 per night (upon request)" },
];

function RoomManage() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [pendingQuantityChange, setPendingQuantityChange] = useState(null);
  const [tempQuantityInputs, setTempQuantityInputs] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [modalKey, setModalKey] = useState(0);
  // const [loading, setLoading] = useState(false);

  // HAPUS slash di akhir
  const API_URL = "https://localhost:7298";

  const parseSafe = (value) => {
    try {
      if (typeof value === "string") {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(i => String(i).replace(/^"+|"+$/g, '')) : [];
      }
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };


  // Fetch Rooms from API
  const fetchRoomsFromAPI = async () => {
    try {
      const res = await fetch(`${API_URL}/api/room`);
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        setRooms([]);
        return;
      }
      let data = await res.json();
      if (!Array.isArray(data)) data = [];

      data = data.map((room) => ({
        ...room,
        images: [room.image1, room.image2, room.image3],
        features: parseSafe(room.features),
        amenities: typeof room.amenities === "string" ? JSON.parse(room.amenities) : [],
        policies: parseSafe(room.policies),
      }));

      setRooms(data);
    } catch (error) {
      setRooms([]);
      console.error("Error fetching rooms:", error);
    }
  };

  // ----------- CRUD -----------
  // ADD Room
  const handleAddRoom = async (roomData) => {
    try {
      const formData = new FormData();

      // Upload gambar terlebih dahulu
      const files = roomData.images.filter(img => img instanceof File);
      let uploaded = ["", "", ""];
      if (files.length) {
        const imageFormData = new FormData();
        files.forEach(img => imageFormData.append("images", img));

        const res = await fetch(`${API_URL}/api/upload/multi`, {
          method: "POST",
          body: imageFormData
        });

        if (!res.ok) {
          alert("Upload gagal!");
          return;
        }

        const result = await res.json();
        uploaded = result.urls || ["", "", ""];
      } else {
        uploaded = roomData.images;
      }

      // Isi FormData untuk Create Room
      formData.append("Title", roomData.title);
      formData.append("ShortDescription", roomData.shortDescription);
      formData.append("FullDescription", roomData.fullDescription);
      formData.append("Price", parseFloat(roomData.price));
      formData.append("Size", roomData.size);
      formData.append("Occupancy", roomData.occupancy);
      formData.append("Bed", roomData.bed);
      formData.append("RoomView", roomData.roomView);
      formData.append("Image1", uploaded[0] || "");
      formData.append("Image2", uploaded[1] || "");
      formData.append("Image3", uploaded[2] || "");
      formData.append("Quantity", parseInt(roomData.quantity, 10) || 1);

      // Format array jadi string atau json
      formData.append("features", JSON.stringify(roomData.features));
      formData.append("policies", JSON.stringify(roomData.policies));
      formData.append("amenities", JSON.stringify(roomData.amenities.map(a => a.name)));

      // Kirim request
      const resp = await fetch(`${API_URL}/api/room`, {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        alert("Tambah Room gagal! Cek API.");
        return;
      }

      fetchRoomsFromAPI && fetchRoomsFromAPI();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error saat menambahkan room:", err);
      alert("Terjadi error saat menambahkan room.");
    }
  };

  const handleUpdateRoom = async (roomId, data) => {
    try {
      const formData = new FormData();

      // Data dasar
      formData.append("Id", roomId);
      formData.append("Title", data.title);
      formData.append("ShortDescription", data.shortDescription);
      formData.append("FullDescription", data.fullDescription);
      formData.append("Price", data.price);
      formData.append("Size", data.size);
      formData.append("Occupancy", data.occupancy);
      formData.append("Bed", data.bed);
      formData.append("RoomView", data.roomView);
      formData.append("Quantity", data.quantity);

      // Ubah array ke format string atau JSON
      formData.append("features", JSON.stringify(data.features));
      formData.append("policies", JSON.stringify(data.policies));
      formData.append("amenities", JSON.stringify(data.amenities.map(a => a.name)));



      // Kirim gambar lama (string) agar tidak terhapus
      formData.append("Image1", typeof data.images[0] === "string" ? data.images[0] : "");
      formData.append("Image2", typeof data.images[1] === "string" ? data.images[1] : "");
      formData.append("Image3", typeof data.images[2] === "string" ? data.images[2] : "");

      // Kirim gambar baru (File)
      data.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("Images", img); // ASP.NET expects List<IFormFile>
        }
      });

      // Kirim ke backend
      const res = await axios.put(
        `https://localhost:7298/api/Room/${roomId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Room updated:", res.data);

      // Refetch data biar policies/amenities/images normal kembali
      setEditingRoom(null);
      fetchRoomsFromAPI();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };




  // DELETE Room
  const handleDeleteRoom = async (id) => {
    await fetch(`${API_URL}/api/room/${id}`, { method: "DELETE" });
    fetchRoomsFromAPI();
  };

  // --- RoomForm & Picker Handler ---
  const RoomForm = ({ initialData, onSubmit }) => {
    const toAmenityObject = (arr) => {
      if (!Array.isArray(arr)) return [];
      if (arr.length > 0 && typeof arr[0] === "object" && arr[0].name) return arr;
      return arr
        .map(name => AMENITY_OPTIONS.find(opt => opt.name === name))
        .filter(Boolean);
    };

    const [showFeaturePicker, setShowFeaturePicker] = useState(false);
    const [showAmenityPicker, setShowAmenityPicker] = useState(false);
    const [showPolicyPicker, setShowPolicyPicker] = useState(false);
    // const [fileNames, setFileNames] = useState({});
    const [inputKeys, setInputKeys] = useState(["0", "1", "2"]);
    const normalizedImages = initialData?.images?.length === 3 ? initialData.images : [null, null, null];

    const [formData, setFormData] = useState({
      id: initialData?.id || "",
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      fullDescription: initialData?.fullDescription || "",
      price: initialData?.price || 0,
      size: initialData?.size || "",
      occupancy: initialData?.occupancy || "",
      bed: initialData?.bed || "",
      roomView: initialData?.roomView || "",
      images: normalizedImages,
      features: initialData?.features || [],
      amenities: toAmenityObject(initialData?.amenities) || [],
      policies: initialData?.policies || [],
      quantity: initialData?.quantity || 1,
    });


    const [previewImages, setPreviewImages] = useState(["", "", ""]);



    useEffect(() => {
      const updatedPreviews = formData.images.map((img) => {
        if (!img) return "";
        if (img instanceof File) return URL.createObjectURL(img);
        if (typeof img === "string" && img.startsWith("/uploads"))
          return `${API_URL}${img}`;
        return img;
      });

      setPreviewImages(updatedPreviews);
    }, [formData.images]);


    const handleSubmit = (e) => {
      e.preventDefault();
      const filteredImages = formData.images.slice(0, 3);
      onSubmit({ ...formData, images: filteredImages });
    };

    const handleImageUpload = (e, index) => {
      const file = e.target.files[0];
      if (!file) return;

      const newImages = [...formData.images];
      newImages[index] = file;

      const newPreview = [...previewImages];
      newPreview[index] = URL.createObjectURL(file);

      const newKeys = [...inputKeys];
      newKeys[index] = Date.now().toString(); // force refresh input

      setFormData((prev) => ({ ...prev, images: newImages }));
      setPreviewImages(newPreview);
      setInputKeys(newKeys);
    };




    const handleImageRemove = (index) => {
      const updatedImages = [...formData.images];
      updatedImages[index] = null;

      const updatedPreviews = [...previewImages];
      updatedPreviews[index] = null;

      const updatedKeys = [...inputKeys];
      updatedKeys[index] = Date.now().toString();

      setFormData((prev) => ({ ...prev, images: updatedImages }));
      setPreviewImages(updatedPreviews);
      setInputKeys(updatedKeys);
    };




    // Tambah Feature
    const addFeatureFromPicker = (featureOption) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.includes(featureOption.name)
          ? prev.features
          : [...prev.features, featureOption.name]
      }));
    };

    // Hapus Feature
    const removeFeature = (index) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    };

    // Tambah Amenity
    const addAmenityFromPicker = (amenityOption) => {
      setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.some(a => a.name === amenityOption.name)
          ? prev.amenities
          : [...prev.amenities, amenityOption]
      }));
    };

    // Hapus Amenity
    // const removeAmenity = (index) => {
    //   setFormData(prev => ({
    //     ...prev,
    //     amenities: prev.amenities.filter((_, i) => i !== index)
    //   }));
    // };

    // Tambah Policy
    const addPolicyFromPicker = (policyOption) => {
      setFormData(prev => ({
        ...prev,
        policies: prev.policies.includes(policyOption.name)
          ? prev.policies
          : [...prev.policies, policyOption.name]
      }));
    };

    // Hapus Policy
    const removePolicy = (index) => {
      setFormData(prev => ({
        ...prev,
        policies: prev.policies.filter((_, i) => i !== index)
      }));
    };

    const formatRupiah = (value) => {
      if (!value) return "Rp 0";
      return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Basic Information */}
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
              borderBottom: "2px solid #d0b375",
              paddingBottom: "5px",
            }}
          >
            Basic Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                Room Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g., Superior Room"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                Short Description *
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="Brief description"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                Price (Rp) *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formatRupiah(formData.price)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^\d]/g, ""); // Hapus semua karakter kecuali angka
                  setFormData((prev) => ({ ...prev, price: Number(rawValue) }));
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>


            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>Size *</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData((prev) => ({ ...prev, size: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g., 35 m²"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                Occupancy *
              </label>
              <input
                type="text"
                value={formData.occupancy}
                onChange={(e) => setFormData((prev) => ({ ...prev, occupancy: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g., 2 Adults"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                Bed Type *
              </label>
              <input
                type="text"
                value={formData.bed}
                onChange={(e) => setFormData((prev) => ({ ...prev, bed: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g., 1 King Bed"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>View *</label>
              <input
                type="text"
                value={formData.roomView}
                onChange={(e) => setFormData((prev) => ({ ...prev, roomView: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                placeholder="e.g., City View"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              Full Description *
            </label>
            <textarea
              value={formData.fullDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                minHeight: "80px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              placeholder="Detailed room description"
              required
            />
          </div>

          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#333",
                display: "block",
              }}
            >
              Quantity of Rooms *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              min="1"
              placeholder="e.g., 5"
              required
            />
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              How many rooms of this type are available in your hotel?
            </div>
          </div>
        </div>

        {/* Room Images */}
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
              borderBottom: "2px solid #d0b375",
              paddingBottom: "5px",
            }}
          >
            Room Images (Maximum 3)
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            {[0, 1, 2].map((index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Label */}
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FiImage size={16} />
                  Image {index + 1} {index === 0 && "(Main)"}
                </label>

                {/* Upload Button */}
                <div>
                  <label
                    htmlFor={`image-upload-${index}`}
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#d0b375",
                      color: "#fff",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      width: "fit-content",
                    }}
                  >
                    Upload File
                  </label>
                  <input
                    key={inputKeys[index]}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    style={{ display: "none" }}
                    id={`image-upload-${index}`}
                  />

                  {/* Nama file */}
                  {formData.images[index] instanceof File && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                      Selected: {formData.images[index].name}
                    </div>
                  )}
                  {typeof formData.images[index] === "string" &&
                    formData.images[index] &&
                    !formData.images[index].includes("blob:") && (
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                        File: {formData.images[index].split("/").pop()}
                      </div>
                    )}
                </div>

                {/* Preview Gambar */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "120px",
                    border: "2px dashed #ddd",
                    borderRadius: "5px",
                    overflow: "hidden",
                    backgroundColor: "#f9f9f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {previewImages[index] ? (
                    <>
                      <img
                        key={previewImages[index]}
                        src={previewImages[index]}
                        alt={`Room preview ${index + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = "/default-placeholder.png";
                        }}
                      />
                      {/* Tombol Remove */}
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: "#ff6868",
                          color: "#fff",
                          border: "none",
                          borderRadius: "3px",
                          padding: "3px 10px",
                          fontSize: "12px",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      <FiImage size={24} />
                      <span>Preview {index + 1}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Features */}
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
              borderBottom: "2px solid #d0b375",
              paddingBottom: "5px",
            }}
          >
            Room Features
          </h3>

          <button
            type="button"
            onClick={() => setShowFeaturePicker(v => !v)}

            style={{
              backgroundColor: "#d0b375",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            <FiPlus size={16} />
            {showFeaturePicker ? "Hide Feature Options" : "Add Features"}
          </button>

          {showFeaturePicker && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "10px",
                marginBottom: "15px",
                maxHeight: "300px",
                overflowY: "auto",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {FEATURE_OPTIONS.map((featureOption) => {
                const isSelected = formData.features.includes(featureOption.name);
                return (
                  <div
                    key={featureOption.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#d0b375" : "#fff",
                      color: isSelected ? "#fff" : "#333",
                      transition: "all 0.2s",
                    }}
                    onClick={() => addFeatureFromPicker(featureOption)}
                  >
                    <span style={{ fontSize: "16px" }}>{featureOption.icon}</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>{featureOption.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              Selected Features ({formData.features.length})
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#e8f5e8",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    border: "1px solid #d0b375",
                  }}
                >
                  <span style={{ color: "#d0b375" }}>{ }</span>
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f44336",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.features.length === 0 && (
              <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                No features selected. Click "Add Features" to choose from available options.
              </p>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
              borderBottom: "2px solid #d0b375",
              paddingBottom: "5px",
            }}
          >
            Amenities
          </h3>

          <button
            type="button"
            onClick={() => setShowAmenityPicker(v => !v)}

            style={{
              backgroundColor: "#d0b375",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            <FiPlus size={16} />
            {showAmenityPicker ? "Hide Amenity Options" : "Add Amenities"}
          </button>

          {showAmenityPicker && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "15px",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {AMENITY_OPTIONS.map((amenityOption) => {
                const isSelected = formData.amenities.some((amenity) => amenity.name === amenityOption.name);

                return (
                  <div
                    key={amenityOption.name}
                    style={{
                      backgroundColor: isSelected ? "#d0b375" : "#f8f5f0",
                      padding: "1.5rem",
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: isSelected ? "2px solid #87723b" : "1px solid #e2e8f0",
                      transform: "translateY(0)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => addAmenityFromPicker(amenityOption)}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        color: isSelected ? "#fff" : "#d09500",
                        marginBottom: "1rem",
                      }}
                    >
                      {amenityOption.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "1rem",
                        color: isSelected ? "#fff" : "#87723b",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {amenityOption.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              Selected Amenities ({formData.amenities.length})
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {formData.amenities.map((amenity, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#e8f5e8",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    border: "1px solid #d0b375",
                  }}
                >
                  <span style={{ color: "#d0b375" }}>{ }</span>
                  <span>{amenity.name}</span>
                  <button
                    type="button"
                    onClick={() => setShowAmenityPicker(v => !v)}

                    style={{
                      background: "none",
                      border: "none",
                      color: "#f44336",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.amenities.length === 0 && (
              <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                No amenities selected. Click "Add Amenities" to choose from available options.
              </p>
            )}
          </div>
        </div>


        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
              borderBottom: "2px solid #d0b375",
              paddingBottom: "5px",
            }}
          >
            Room Policies
          </h3>

          <button
            type="button"
            onClick={() => setShowPolicyPicker(v => !v)}

            style={{
              backgroundColor: "#d0b375",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "10px 15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            <FaPlus size={16} />
            {showPolicyPicker ? "Hide Policy Options" : "Add Policies"}
          </button>

          {showPolicyPicker && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "10px",
                marginBottom: "15px",
                maxHeight: "300px",
                overflowY: "auto",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {POLICY_OPTIONS.map((policyOption) => {
                const isSelected = formData.policies.includes(policyOption.name);

                return (
                  <div
                    key={policyOption.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#d0b375" : "#fff",
                      color: isSelected ? "#fff" : "#333",
                      transition: "all 0.2s",
                    }}
                    onClick={() => addPolicyFromPicker(policyOption)}
                  >
                    <span style={{ fontSize: "16px" }}>{policyOption.icon}</span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>{policyOption.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              Selected Policies ({formData.policies.length})
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
              {formData.policies.map((policy, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#e8f5e8",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    border: "1px solid #d0b375",
                  }}
                >
                  <span style={{ color: "#d0b375" }}>{ }</span>
                  <span>{policy}</span>
                  <button
                    type="button"
                    onClick={() => removePolicy(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f44336",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
            {formData.policies.length === 0 && (
              <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                No policies selected. Click "Add Policies" to choose from available options.
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            backgroundColor: "#d0b375",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          {initialData ? "Update Room Type" : "Add Room Type"}
        </button>
      </form>
    )
  }


  // Card Romm Grid 

  // Component logic
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const saveRooms = (updatedRooms) => {
    setRooms(updatedRooms)
    const tempInputs = {}
    updatedRooms.forEach((room) => {
      tempInputs[room.id] = room.quantity
    })
    setTempQuantityInputs(tempInputs)
  }

  // const handleEditRoom = (roomData) => {
  //   if (!editingRoom) return

  //   console.log("Editing room with data:", roomData) // Debug log
  //   const updatedRooms = rooms.map((room) => (room.id === editingRoom.id ? { ...roomData, id: editingRoom.id } : room))
  //   saveRooms(updatedRooms)
  //   setEditingRoom(null)
  // }

  const requestQuantityChange = (roomId, newQuantity, changeType) => {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return

    if (newQuantity < 0) return

    setPendingQuantityChange({
      roomId,
      roomTitle: room.title,
      currentQuantity: room.quantity,
      newQuantity,
      changeType,
    })
  }

  const confirmQuantityChange = () => {
    if (!pendingQuantityChange) return

    const updatedRooms = rooms.map((room) =>
      room.id === pendingQuantityChange.roomId ? { ...room, quantity: pendingQuantityChange.newQuantity } : room,
    )
    saveRooms(updatedRooms)
    setPendingQuantityChange(null)
  }

  const cancelQuantityChange = () => {
    if (pendingQuantityChange) {
      setTempQuantityInputs((prev) => ({
        ...prev,
        [pendingQuantityChange.roomId]: pendingQuantityChange.currentQuantity,
      }))
    }
    setPendingQuantityChange(null)
  }

  const handleIncrementRequest = (roomId) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      requestQuantityChange(roomId, room.quantity + 1, "increment")
    }
  }

  const handleDecrementRequest = (roomId) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room && room.quantity > 0) {
      requestQuantityChange(roomId, room.quantity - 1, "decrement")
    }
  }

  const handleDirectQuantityChange = (roomId, newQuantity) => {
    setTempQuantityInputs((prev) => ({
      ...prev,
      [roomId]: newQuantity,
    }))
  }

  const handleQuantityInputBlur = (roomId) => {
    const room = rooms.find((r) => r.id === roomId)
    const newQuantity = tempQuantityInputs[roomId]

    if (room && newQuantity !== room.quantity && newQuantity >= 0) {
      requestQuantityChange(roomId, newQuantity, "direct")
    }
  }

  useEffect(() => { fetchRoomsFromAPI(); }, []);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);


  return (
    <div className="room-manage-page">
      <style>{`
        /* Room Management Page Styles */
        .room-manage-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Segoe UI', sans-serif;
        }

        .main-content {
          flex: 1;
          padding: 30px;
          background-color: #f5f2db;
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .page-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 30px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .add-button {
          background-color: #d0b375;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-button:hover {
          background-color: #87723b;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .room-card {
          background-color: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .room-image-container {
          position: relative;
        }

        .room-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .quantity-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: rgba(208, 181, 117, 0.9);
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
        }

        .price-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
          color: #333;
        }

        .room-content {
          padding: 20px;
        }

        .room-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }

        .room-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
        }

        .room-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 15px;
          font-size: 14px;
          color: #444;
        }

        .quantity-section {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border: 1px solid #eee;
        }

        .quantity-header {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-button {
          background-color: #d0b375;
          color: #fff;
          border: none;
          border-radius: 4px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
        }

        .quantity-button:hover {
          background-color: #87723b;
        }

        .quantity-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .quantity-input {
          width: 60px;
          padding: 5px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
        }

        .quantity-display {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          min-width: 40px;
          text-align: center;
        }

        .quantity-label {
          font-size: 14px;
          color: #666;
        }

        .room-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 6px;
          border: none;
          font-weight: bold;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .edit-btn {
          background-color: #4caf50;
        }

        .edit-btn:hover {
          background-color: #45a049;
        }

        .delete-btn {
          background-color: #f44336;
        }

        .delete-btn:hover {
          background-color: #da190b;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
          font-size: 18px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background-color: #fff;
          border-radius: 10px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: auto;
          position: relative;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .close-button:hover {
          color: #333;
        }

        .modal-content {
          padding: 20px;
        }

        .confirmation-dialog {
          background-color: #fff;
          border-radius: 10px;
          padding: 25px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .confirmation-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
          text-align: center;
        }

        .confirmation-message {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          text-align: center;
          line-height: 1.5;
        }

        .confirmation-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .confirm-button {
          background-color: #4caf50;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .confirm-button:hover {
          background-color: #45a049;
        }

        .cancel-button {
          background-color: #f44336;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cancel-button:hover {
          background-color: #da190b;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .rooms-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }

          .room-details {
            grid-template-columns: 1fr;
          }

          .quantity-controls {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 20px;
          }

          .page-title {
            font-size: 24px;
          }

          .room-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <SidebarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />

      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Room Management</h1>
            <p className="page-subtitle">
              Total Rooms: { } | Room Types: {rooms.length}
            </p>
          </div>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <FiPlusCircle size={20} />
            Add New Room Type
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image-container">
                <img
                  src={
                    room.images && room.images[0]
                      ? (room.images[0].startsWith('/uploads/')
                        ? `https://localhost:7298${room.images[0]}`
                        : room.images[0])
                      : "https://via.placeholder.com/350x200"
                  }
                  alt={room.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div className="quantity-badge">{room.quantity} rooms</div>
                <div className="price-badge">{formatRupiah(room.price)} / night</div>
              </div>

              <div className="room-content">
                <h3 className="room-title">{room.title}</h3>
                <p className="room-description">{room.shortDescription}</p>

                <div className="room-details">
                  <div>
                    <strong>Size:</strong> {room.size}
                  </div>
                  <div>
                    <strong>Occupancy:</strong> {room.occupancy}
                  </div>
                  <div>
                    <strong>Bed:</strong> {room.bed}
                  </div>
                  <div>
                    <strong>View:</strong> {room.view}
                  </div>
                </div>

                {/* Features Section */}
                {(() => {
                  const features = Array.isArray(room.features)
                    ? room.features
                    : parseSafe(room.features); // fallback kalau string JSON

                  return features.length > 0 && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                        Features:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#e8f5e8",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              color: "#333",
                              border: "1px solid #d0b375",
                            }}
                          >
                            {String(feature)}
                          </span>
                        ))}
                        {features.length > 3 && (
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            +{features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}





                {/* Amenities Section */}
                {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                      Amenities:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#e8eaf6",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#333",
                            border: "1px solid #7986cb",
                          }}
                        >
                          {typeof amenity === "object" && amenity.name ? amenity.name : String(amenity)}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Policies Section */}
                {(() => {
                  const policies = Array.isArray(room.policies)
                    ? room.policies
                    : parseSafe(room.policies);

                  return policies.length > 0 && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                        Policies:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {policies.slice(0, 2).map((policy, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#fff8e1",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              color: "#333",
                              border: "1px solid #d0b375",
                            }}
                          >
                            {String(policy)}
                          </span>
                        ))}
                        {policies.length > 2 && (
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            +{policies.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}



                {/* Quantity Controls */}
                <div className="quantity-section">
                  <div className="quantity-header">Room Quantity</div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleDecrementRequest(room.id)}
                      disabled={room.quantity <= 0}
                    >
                      <FiMinus size={16} />
                    </button>

                    <div className="quantity-display">{room.quantity}</div>

                    <button className="quantity-button" onClick={() => handleIncrementRequest(room.id)}>
                      <FiPlus size={16} />
                    </button>

                    <span className="quantity-label">rooms available</span>

                    <input
                      type="number"
                      value={tempQuantityInputs[room.id] || room.quantity}
                      onChange={(e) => handleDirectQuantityChange(room.id, Number.parseInt(e.target.value) || 0)}
                      onBlur={() => handleQuantityInputBlur(room.id)}
                      className="quantity-input"
                      min="0"
                    />
                  </div>
                </div>

                <div className="room-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => setEditingRoom({
                      ...room,
                      images: [room.image1, room.image2, room.image3]
                    })}
                  >
                    <FiEdit size={16} />
                    Edit
                  </button>

                  <button className="action-btn delete-btn" onClick={() => handleDeleteRoom(room.id)}>
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="empty-state">
            <p>No rooms found. Add your first room type to get started!</p>
          </div>
        )}

        {/* Quantity Change Confirmation Dialog */}
        {pendingQuantityChange && (
          <div className="modal-overlay">
            <div className="confirmation-dialog">
              <h3 className="confirmation-title">Confirm Quantity Change</h3>
              <p className="confirmation-message">{ }</p>
              <div className="confirmation-buttons">
                <button className="confirm-button" onClick={confirmQuantityChange}>
                  <FiCheck size={16} />
                  Confirm
                </button>
                <button className="cancel-button" onClick={cancelQuantityChange}>
                  <FiX size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Room Modal (SELALU ADA, cuma toggle show/hide) */}
        <div className="modal-overlay" style={{ display: showAddModal ? "flex" : "none" }}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Room Type</h2>
              <button className="close-button" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <RoomForm onSubmit={handleAddRoom} />
            </div>
          </div>
        </div>

        {/* Edit Room Modal */}
        <div className="modal-overlay" style={{ display: editingRoom ? "flex" : "none" }}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Edit Room Type</h2>
              <button className="close-button" onClick={() => setEditingRoom(null)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              {editingRoom && (
                <RoomForm
                  initialData={editingRoom}
                  onSubmit={(data) => {
                    if (editingRoom && data) {
                      handleUpdateRoom(editingRoom.id, data);
                    } else {
                      console.error("Editing room or data is undefined", editingRoom, data);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
};

export default RoomManage
