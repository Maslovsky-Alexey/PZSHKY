using System.Xml;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using ElectronicSchem.Models;
using System.Linq;

namespace ElectronicSchem.Controllers
{
    public class SchemController : Controller
    {
        // GET: Schem
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string GetComponents()
        {
            XmlDocument doc = new XmlDocument();

            if (GetLanguage() == "Ru")
                doc.LoadXml(Properties.ResourcesRu.Components);
            else
                doc.LoadXml(Properties.ResourcesEn.Components);

            return Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc["components"]).Replace("@", "");
        }

        private ApplicationUser GetCurrentUser()
        {
            ApplicationUser user = System.Web.HttpContext.Current.GetOwinContext()
                  .GetUserManager<ApplicationUserManager>().FindById(System.Web.HttpContext.Current.User.Identity.GetUserId());

            ApplicationDbContext databaseContext = new ApplicationDbContext();

            if (user != null)
                return databaseContext.Users.FirstOrDefault(x => x.Id == user.Id);
            else
                return null;
        }

        [HttpPost]
        public void ChangeLanguage(string language)
        {
            HttpContext.Response.Cookies.Add(new HttpCookie("language", language));
        }

        private string GetLanguage()
        {
            return string.IsNullOrEmpty(HttpContext.Request.Cookies.Get("language")?.Value) ? "En" : HttpContext.Request.Cookies.Get("language").Value;
        }


    }
}