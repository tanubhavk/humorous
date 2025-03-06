import numpy as np
import pandas as pd  # type: ignore
import json
import folium
from folium.plugins import HeatMap
from sklearn.cluster import KMeans

# Step 1: Generate Random Data for Pune
np.random.seed(42)
num_locations = 100
latitudes = np.random.uniform(18.45, 18.65, num_locations)
longitudes = np.random.uniform(73.75, 74.05, num_locations)
population_density = np.random.randint(500, 5000, num_locations)
orders = np.random.randint(50, 1000, num_locations)
profit = orders * np.random.uniform(50, 200, num_locations)
revenue = profit * np.random.uniform(1.2, 1.5, num_locations)

# Step 2: Create a DataFrame
data = pd.DataFrame({
    "Latitude": latitudes,
    "Longitude": longitudes,
    "Population_Density": population_density,
    "Orders": orders,
    "Profit": profit,
    "Revenue": revenue
})

# Step 3: Save Data to JSON
json_file_path = "JSON.json"
with open(json_file_path, "w") as json_file:
    json.dump(data.to_dict(orient="records"), json_file, indent=4)

# Step 4: Apply KMeans Clustering to Identify Warehouse Locations
features = data[["Latitude", "Longitude", "Population_Density", "Orders", "Profit", "Revenue"]]
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
data["Cluster"] = kmeans.fit_predict(features)
# Get initial warehouse locations (cluster centers)
warehouse_locations = pd.DataFrame(kmeans.cluster_centers_, columns=features.columns)[["Latitude", "Longitude"]]

# Function to filter warehouse locations so they are not too close
def filter_close_locations(warehouse_df, min_distance=0.01):
    filtered = []
    for idx, row in warehouse_df.iterrows():
        lat, lon = row['Latitude'], row['Longitude']
        too_close = False
        for loc in filtered:
            # Calculate Euclidean distance in lat-long space (approximate)
            dist = np.sqrt((lat - loc['Latitude'])**2 + (lon - loc['Longitude'])**2)
            if dist < min_distance:
                too_close = True
                break
        if not too_close:
            filtered.append({'Latitude': lat, 'Longitude': lon})
    return pd.DataFrame(filtered)

# Step 4.1: Filter warehouse locations to ensure they are not near each other
warehouse_locations = filter_close_locations(warehouse_locations, min_distance=0.01)

# Step 5: Save Warehouse Locations to JSON
warehouse_json_file_path = "JSON_2.json"
with open(warehouse_json_file_path, "w") as json_file:
    json.dump(warehouse_locations.to_dict(orient="records"), json_file, indent=4)

# Step 6: Create Pune Heatmap
pune_map = folium.Map(location=[18.5204, 73.8567], zoom_start=12)

# Compute Weighted Score for Heatmap Intensity
data["Weighted_Score"] = (
    data["Population_Density"] * 0.3 +
    data["Orders"] * 0.3 +
    data["Profit"] * 0.2 +
    data["Revenue"] * 0.2
)
data["Weighted_Score"] = (data["Weighted_Score"] - data["Weighted_Score"].min()) / (data["Weighted_Score"].max() - data["Weighted_Score"].min())

heat_data = data[["Latitude", "Longitude", "Weighted_Score"]].values.tolist()
HeatMap(heat_data, radius=15, blur=10).add_to(pune_map)

# Step 7: Add Legend for Intensity Scale
legend_html = '''
<div style="position: fixed; bottom: 50px; left: 50px; width: 200px; height: 90px; background-color: white; z-index:9999; font-size:14px; padding:10px; border-radius:5px;">
    <b>Heatmap Intensity</b><br>
    <i style="background: red; width: 10px; height: 10px; display: inline-block;"></i> High<br>
    <i style="background: yellow; width: 10px; height: 10px; display: inline-block;"></i> Medium<br>
    <i style="background: green; width: 10px; height: 10px; display: inline-block;"></i> Low
</div>
'''
pune_map.get_root().html.add_child(folium.Element(legend_html))

# Step 8: Add Warehouse Locations with Informative Descriptions
for _, row in warehouse_locations.iterrows():
    # Find if any nearby data point exists (for additional reasoning, if needed)
    nearby_data = data[(data["Latitude"] == row["Latitude"]) & (data["Longitude"] == row["Longitude"])]
    reasoning = "This warehouse is strategically placed based on high demand, population density, and profitability."
    if not nearby_data.empty:
        reasoning += " An existing warehouse is in close proximity; further analysis is needed to optimize efficiency."
    
    folium.Marker(
        location=[row["Latitude"], row["Longitude"]],
        popup=(
            f"<b>Proposed Warehouse Location</b><br>"
            f"Reasoning: {reasoning}<br>"
            f"Alternative locations had lower demand or lower profitability."
        ),
        icon=folium.Icon(color="red", icon="home")
    ).add_to(pune_map)

# Step 9: Add a popup that appears on page load using custom JavaScript
popup_script = """
<script>
    window.onload = function() {
        alert("The heatmaps are the end data generated after taking into consideration the different parameters, and after that we have selected some places to setup the dark stores in.");
    }
</script>
"""
pune_map.get_root().html.add_child(folium.Element(popup_script))

# Step 10: Save and Display Map
heatmap_file_path = "pune_heatmap.html"
pune_map.save(heatmap_file_path)

print(f"Heatmap saved as {heatmap_file_path}. Open this file in a browser to view the map.")
