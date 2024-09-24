using Microsoft.AspNetCore.Mvc;
using OrsaDemoModels;
using OrsaDemoModels.Entity;
using OrsaDemoModels.Entity.VmModel;
using OrsaDemoWebApp.Models.Interface;
using System.Threading.Tasks;
using System.Collections.Generic;


namespace OrsaDemoWebApp.Controllers
{
    public class RequestController : Controller
    {

        private readonly IListPersonnelsService _ListPersonnelsService;

        public RequestController(IPersonnelsService personnelsService, IListPersonnelsService listPersonnelsService)
        {

            _ListPersonnelsService = listPersonnelsService;

        }

        // It views List Personnels page - FA - 23.07.2024
        public IActionResult PersonnelList()
        {

            return View();

        }

        [HttpGet]
        public async Task<List<vmListPersonnel>> ListPersonnels()
        {

            var result = await _ListPersonnelsService.ListPersonnels();
            return result;

        }

    }
}
