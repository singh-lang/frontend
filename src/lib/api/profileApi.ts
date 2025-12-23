import { baseApi } from './baseApi';

export interface UserProfile {
  name: string;
  phoneNum: string;
  emirate: string;
  address: string;
  emiratesId: string;
  licenseNum: string;
  email: string; // fixed
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({ url: '/user-profile/edit', method: 'GET' }),
    }),
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({
        url: '/user-profile/update',
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetUserProfileQuery, useUpdateUserProfileMutation } = profileApi;
