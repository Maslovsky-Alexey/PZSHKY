using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElectronicSchem.Models;
using System.Resources;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;

namespace ElectronicSchem.Controllers
{
    public class HomeController : Controller
    {


        public ActionResult Index(string tag, string category)
        {
            ViewBag.Tag = tag;
            ViewBag.Category = category;
            string[] idCategories = new ApplicationDbContext().Categories.Select(x => x.Name).ToArray();

            ViewBag.Categories = idCategories.Select(x => GetTextFromResourceByKey(x));           

            ViewBag.isHome = true;
            ViewBag.Languages = GetLanguage();
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        private string GetLanguage()
        {
            return string.IsNullOrEmpty(HttpContext.Request.Cookies.Get("language")?.Value) ? "En" : HttpContext.Request.Cookies.Get("language").Value;
        }


        private string GetTextFromResourceByKey(string key)
        {
            if (GetLanguage() == "Ru")
                return Properties.ResourcesRu.ResourceManager.GetString(key);
            else
                return Properties.ResourcesEn.ResourceManager.GetString(key);
        }


    }
}