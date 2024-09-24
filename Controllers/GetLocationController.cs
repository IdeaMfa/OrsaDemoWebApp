using Microsoft.AspNetCore.Mvc;
using OrsaDemoModels.Entity;
using OrsaDemoWebApp.Models.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace OrsaDemoWebApp.Controllers
{
    public class GetLocationController : Controller
    {

        private readonly IGeograpyService _geographyService;

        public GetLocationController(IGeograpyService geographyService)
        {
            _geographyService = geographyService;
        }
        [HttpGet]
        public async Task<List<Geography>> GetLocation(int ParentId)
        {

            var result = await _geographyService.GetLocation(ParentId);

            return result;

        }
        [HttpGet]
        public async Task<List<Geography>> GetAllLocations()
        {

            var result = await _geographyService.GetAllLocations();

            return result;

        }
    }
}
