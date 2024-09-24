using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using OrsaDemoModels.Entity;
using System.Linq;

namespace OrsaDemoWebApp.Controllers
{
    public class ModelValidController : Controller
    {

        [HttpPost]
        public IActionResult ValidateModel(Geography personnels)
        {

            if (!ModelState.IsValid)
            {

                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage.ToList());
                return Json(new { success = false, errors = errors });

            }
            else { 
            
                return Json(new { success = true } );
            
            }

        }


    }
}
