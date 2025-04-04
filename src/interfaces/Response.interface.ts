export default interface responseT {
  message?: string;
  data?: {
    data: unknown;
    totalCount: number;
    page?: number;
    limit?: number;
    order?: string;
    sort?: string;
    isNextPage?: boolean;
  };
  status: number;
  toast: boolean;
  success: boolean;
}
