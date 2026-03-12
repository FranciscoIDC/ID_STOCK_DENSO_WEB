using ID_STOCK_SODISA_WEB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace ID_STOCK_SODISA_WEB.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;

        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            ViewBag.PathBase = _configuration["AppSettings:PathBase"] ?? "";
            ViewBag.WebApiUrl = _configuration["AppSettings:WebApiUrl"] ?? "http://localhost:59020/api/";
            return View();
        }

        public IActionResult Auth()
        {
            ViewBag.PathBase = _configuration["AppSettings:PathBase"] ?? "";
            ViewBag.WebApiUrl = _configuration["AppSettings:WebApiUrl"] ?? "http://localhost:59020/api/";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
