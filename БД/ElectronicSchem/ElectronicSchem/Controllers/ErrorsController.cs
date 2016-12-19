using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ElectronicSchem.Controllers
{
    public class ErrorsController : Controller
    {
        // GET: Errors
        public ActionResult NotFound()
        {
            ViewBag.Languages = GetLanguage();
            return View();
        }

        public ActionResult Error()
        {
            ViewBag.Languages = GetLanguage();
            return View();
        }


        private string GetLanguage()
        {
            return string.IsNullOrEmpty(HttpContext.Request.Cookies.Get("language")?.Value) ? "En" : HttpContext.Request.Cookies.Get("language").Value;
        }
    }
}