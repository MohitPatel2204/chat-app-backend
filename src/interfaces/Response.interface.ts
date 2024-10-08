export default interface responseT {
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
