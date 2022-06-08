export interface CheckUserExistsByEmailRepository {
  check: (email: string) => Promise<boolean>
}
