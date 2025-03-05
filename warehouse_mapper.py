import numpy as np
import pandas as pd
import json
import folium
from folium.plugins import HeatMap
from sklearn.cluster import KMeans

def process_json_input(json_input):
    data = pd.DataFrame(json.loads(json_input))
    features = data[["Latitude", "Longitude", "Population_Density", "Orders", "Profit", "Revenue"]]
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    data["Cluster"] = kmeans.fit_predict(features)
    warehouse_locations = pd.DataFrame(kmeans.cluster_centers_, columns=features.columns)[["Latitude", "Longitude"]]
    return warehouse_locations, data

def create_map(warehouse_locations, data):
    pune_map = folium.Map(location=[18.5204, 73.8567], zoom_start=12)
    data["Weighted_Score"] = (
        data["Population_Density"] * 0.3 +
        data["Orders"] * 0.3 +
        data["Profit"] * 0.2 +
        data["Revenue"] * 0.2
    )
    data["Weighted_Score"] = (data["Weighted_Score"] - data["Weighted_Score"].min()) / (data["Weighted_Score"].max() - data["Weighted_Score"].min())
    heat_data = data[["Latitude", "Longitude", "Weighted_Score"]].values.tolist()
    HeatMap(heat_data, radius=15, blur=10).add_to(pune_map)

    for _, row in warehouse_locations.iterrows():
        folium.Marker(
            location=[row["Latitude"], row["Longitude"]],
            popup="Warehouse Location",
            icon=folium.Icon(color="red", icon="home")
        ).add_to(pune_map)

    pune_map.save("warehouse_map.html")

if __name__ == "__main__":
    json_input = input("Enter JSON data: ")
    warehouse_locations, data = process_json_input(json_input)
    create_map(warehouse_locations, data)
