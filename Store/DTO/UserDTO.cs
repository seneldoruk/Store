namespace Store.DTO;

public class LoginDTO
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class RegisterDTO : LoginDTO
{
    public string Email { get; set; }
}