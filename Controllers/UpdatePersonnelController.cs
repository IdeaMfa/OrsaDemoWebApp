using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrsaDemoModels.Entity;
using OrsaDemoModels.Entity.VmModel;
using OrsaDemoWebApp.Models.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OrsaDemoWebApp.Controllers
{
    public class UpdatePersonnelController : Controller
    {

        private readonly IUpdatePersonnelService _updateService;

        public UpdatePersonnelController(IUpdatePersonnelService updateService)
        {
            _updateService = updateService;
        }

        public IActionResult PersonnelUpdatePage()
        {
            return View();
        }

        [HttpGet]
        public async Task<vmListPersonnel> EditPersonnel(int Id)
        {

            var result = await _updateService.EditPersonnelGetData(Id);

            return result;

        }

        [HttpPut]
        public async Task<Personnels> EditPersonnelPut(Personnels  personnels)
        {

            var result = await _updateService.EditPersonnelPutData(personnels);

            return result;

        }

        [HttpPut]
        [Route("/DeletePersonnelPhotos")]
        public async Task<bool> DeletePersonnelPhotos(List<int> Ids)
        {

            if (Ids.Count > 0)
            {

                var result = await _updateService.DeletePersonnelPhotos(Ids);

                return result;

            }
            else
            {
                return false;
            }

        }

        [HttpPut]
        public async Task<bool> DeleteInstitutionMedia(List<int> Ids)
        {
            var result = await _updateService.DeleteInstitutionMedia(Ids);

            return result;
        }

        [HttpPut]
        public async Task<bool> UpdateRepeatingField(IFormCollection PersonnelInstitutionUpdateData)
        {
            var result = await _updateService.UpdateRepeatingFieldService(PersonnelInstitutionUpdateData);

            return result;
        }

        [HttpPut]
        public async Task<bool> InstitutionDataDelete(int Id)
        {
            var result = await _updateService.InstitutionDataDeleteService(Id);

            return result;
        }

    }
}
