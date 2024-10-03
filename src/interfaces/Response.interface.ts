export default interface responseT {
  error?: string;
  message?: string;
  data?: {
    data: unknown;
    totalCount: number;
  };
  status: number;
  toast: boolean;
  success: boolean;
  token?: string;
}
