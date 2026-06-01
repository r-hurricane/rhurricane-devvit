import {SummaryApiDto} from "./dtos/redis/summary-api/SummaryApiDtos";
import {UserPreferencesDto} from "./dtos/redis/UserPreferencesDto";

export type ApiErrorResponse = {
  error: string;
};

export type LandingInitResponse = {
  isDev: boolean;
  summaryApiData: SummaryApiDto | null;
  maintenanceMode: 'Off' | 'Soft' | 'Hard';
  maintenanceMessage: string | null;
  userPreferences: UserPreferencesDto | null;
};
