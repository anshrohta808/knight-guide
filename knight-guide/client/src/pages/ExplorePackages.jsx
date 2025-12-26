import React, { useState, useEffect } from "react";

const ExplorePackages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Mock data based on the CSV
    const mockPackages = [
      {
        Package_ID: 1,
        Package_Name: "Goa Beach Escape",
        Destination: "Goa",
        Country: "India",
        Duration_Days: 5,
        Price_USD: 350,
        Accommodation_Type: "Resort",
        Transport_Mode: "Flight",
        Season: "Summer",
        Accessibility_Level: "Medium",
        Description: "Relaxing beach holiday with water sports and nightlife.",
        Rating: 4.3,
        Available_Slots: 15,
        Guide_Included: false,
        Start_Date: "12/5/2025",
        End_Date: "12/10/2025",
        Category: "Beach",
        Discount_Percent: 10,
        Meals_Included: true,
        Contact_Number: "-9876543119",
        image:
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 2,
        Package_Name: "Golden Triangle Tour",
        Destination: "Delhi-Agra-Jaipur",
        Country: "India",
        Duration_Days: 6,
        Price_USD: 500,
        Accommodation_Type: "Hotel",
        Transport_Mode: "Bus",
        Season: "Winter",
        Accessibility_Level: "High",
        Description: "Historic circuit covering Taj Mahal and royal palaces.",
        Rating: 4.6,
        Available_Slots: 10,
        Guide_Included: true,
        Start_Date: "11/20/2025",
        End_Date: "11/26/2025",
        Category: "Cultural",
        Discount_Percent: 5,
        Meals_Included: true,
        Contact_Number: "-9123456698",
        image:
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 3,
        Package_Name: "Himalayan Adventure",
        Destination: "Manali",
        Country: "India",
        Duration_Days: 7,
        Price_USD: 600,
        Accommodation_Type: "Guesthouse",
        Transport_Mode: "Car",
        Season: "Winter",
        Accessibility_Level: "Low",
        Description: "Trekking and camping in the Himalayas.",
        Rating: 4.7,
        Available_Slots: 8,
        Guide_Included: true,
        Start_Date: "1/10/2026",
        End_Date: "1/17/2026",
        Category: "Adventure",
        Discount_Percent: 15,
        Meals_Included: false,
        Contact_Number: "-9988776564",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 4,
        Package_Name: "Bali Bliss",
        Destination: "Bali",
        Country: "Indonesia",
        Duration_Days: 5,
        Price_USD: 850,
        Accommodation_Type: "Villa",
        Transport_Mode: "Flight",
        Season: "All",
        Accessibility_Level: "Medium",
        Description:
          "Island retreat with temples, beaches, and cultural shows.",
        Rating: 4.8,
        Available_Slots: 20,
        Guide_Included: false,
        Start_Date: "2/15/2026",
        End_Date: "2/20/2026",
        Category: "Romantic",
        Discount_Percent: 10,
        Meals_Included: true,
        Contact_Number: "-8123456727",
        image:
          "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 5,
        Package_Name: "Paris Romance",
        Destination: "Paris",
        Country: "France",
        Duration_Days: 4,
        Price_USD: 1200,
        Accommodation_Type: "Hotel",
        Transport_Mode: "Flight",
        Season: "Spring",
        Accessibility_Level: "High",
        Description: "Romantic getaway with Eiffel Tower and Seine cruise.",
        Rating: 4.9,
        Available_Slots: 12,
        Guide_Included: true,
        Start_Date: "3/10/2026",
        End_Date: "3/14/2026",
        Category: "Romantic",
        Discount_Percent: 8,
        Meals_Included: true,
        Contact_Number: "-612345645",
        image:
          "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 6,
        Package_Name: "Swiss Alps Explorer",
        Destination: "Zurich-Swiss Alps",
        Country: "Switzerland",
        Duration_Days: 7,
        Price_USD: 1500,
        Accommodation_Type: "Hotel",
        Transport_Mode: "Train",
        Season: "Winter",
        Accessibility_Level: "Medium",
        Description: "Scenic mountain trip with skiing and chocolate tours.",
        Rating: 4.8,
        Available_Slots: 9,
        Guide_Included: true,
        Start_Date: "1/25/2026",
        End_Date: "2/1/2026",
        Category: "Adventure",
        Discount_Percent: 12,
        Meals_Included: true,
        Contact_Number: "-789456082",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 7,
        Package_Name: "Desert Safari",
        Destination: "Dubai",
        Country: "UAE",
        Duration_Days: 3,
        Price_USD: 700,
        Accommodation_Type: "Resort",
        Transport_Mode: "Flight",
        Season: "Winter",
        Accessibility_Level: "Medium",
        Description: "Dune bashing, camel rides, and desert camping.",
        Rating: 4.5,
        Available_Slots: 18,
        Guide_Included: true,
        Start_Date: "12/15/2025",
        End_Date: "12/18/2025",
        Category: "Adventure",
        Discount_Percent: 10,
        Meals_Included: true,
        Contact_Number: "-501233596",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 8,
        Package_Name: "Kerala Backwaters",
        Destination: "Alleppey",
        Country: "India",
        Duration_Days: 4,
        Price_USD: 400,
        Accommodation_Type: "Houseboat",
        Transport_Mode: "Car",
        Season: "Monsoon",
        Accessibility_Level: "High",
        Description: "Peaceful cruise through palm-lined backwaters.",
        Rating: 4.4,
        Available_Slots: 14,
        Guide_Included: false,
        Start_Date: "11/25/2025",
        End_Date: "11/29/2025",
        Category: "Nature",
        Discount_Percent: 5,
        Meals_Included: true,
        Contact_Number: "-9345678810",
        image:
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 9,
        Package_Name: "Tokyo Tech Tour",
        Destination: "Tokyo",
        Country: "Japan",
        Duration_Days: 6,
        Price_USD: 1400,
        Accommodation_Type: "Hotel",
        Transport_Mode: "Flight",
        Season: "All",
        Accessibility_Level: "Medium",
        Description: "Modern city tour with tech museums and anime spots.",
        Rating: 4.7,
        Available_Slots: 11,
        Guide_Included: true,
        Start_Date: "2/20/2026",
        End_Date: "2/26/2026",
        Category: "Cultural",
        Discount_Percent: 10,
        Meals_Included: false,
        Contact_Number: "-9012345597",
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 10,
        Package_Name: "New York Explorer",
        Destination: "New York",
        Country: "USA",
        Duration_Days: 5,
        Price_USD: 1300,
        Accommodation_Type: "Hotel",
        Transport_Mode: "Flight",
        Season: "All",
        Accessibility_Level: "High",
        Description: "City landmarks, shopping, and Broadway shows.",
        Rating: 4.6,
        Available_Slots: 13,
        Guide_Included: true,
        Start_Date: "12/10/2025",
        End_Date: "12/15/2025",
        Category: "Urban",
        Discount_Percent: 7,
        Meals_Included: true,
        Contact_Number: "-2125551233",
        image:
          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      },
    ];
    setPackages(mockPackages);
  }, []);

  return (
    <div className="page" style={{ paddingTop: "80px" }}>
      <div className="container">
        <h1
          className="hero-title animate-fadeIn"
          style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
        >
          🌍 Explore Travel Packages
        </h1>
        <p
          className="hero-subtitle animate-fadeIn"
          style={{ animationDelay: "0.1s", marginBottom: "3rem" }}
        >
          Discover amazing destinations with our curated travel packages
          designed for accessibility and adventure.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "2rem",
          }}
        >
          {packages.map((pkg) => (
            <div
              key={pkg.Package_ID}
              className="glass-panel animate-fadeIn"
              style={{
                borderRadius: "var(--radius-lg)",
                background: "var(--color-bg-glass)",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div
                style={{
                  height: "200px",
                  backgroundImage: `url(${pkg.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {pkg.Package_Name}
                    </h3>
                    <p
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {pkg.Destination}, {pkg.Country}
                    </p>
                  </div>
                  <div
                    style={{
                      background: "var(--color-primary)",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                    }}
                  >
                    {pkg.Category}
                  </div>
                </div>

                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {pkg.Description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "var(--color-primary)",
                      }}
                    >
                      ${pkg.Price_USD}
                    </span>
                    {pkg.Discount_Percent > 0 && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          textDecoration: "line-through",
                          color: "var(--color-text-secondary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        $
                        {(
                          pkg.Price_USD *
                          (1 + pkg.Discount_Percent / 100)
                        ).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ color: "#fbbf24" }}>⭐</span>
                    <span style={{ fontWeight: "500" }}>{pkg.Rating}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    fontSize: "0.8rem",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <div>📅 {pkg.Duration_Days} days</div>
                  <div>🏨 {pkg.Accommodation_Type}</div>
                  <div>✈️ {pkg.Transport_Mode}</div>
                  <div>
                    🍽️{" "}
                    {pkg.Meals_Included
                      ? "Meals included"
                      : "Meals not included"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {pkg.Available_Slots} slots available
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePackages;
