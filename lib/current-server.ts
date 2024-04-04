import { ServerWithAllProperty } from "@/types";
import axios from "axios";

export const getServer = async ({serverId}: {serverId:string}) => {

  try {
    const response = await axios.get<ServerWithAllProperty>(
      `/api/servers/${serverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching server data:", error);
    return null
  }
};
