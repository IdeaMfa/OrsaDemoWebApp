using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using OrsaDemoModels;
using OrsaDemoModels.Entity;
using System.Threading.Tasks;
using OrsaDemoWebApp.Models.Interface;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace OrsaDemoWebApp.Controllers
{
    public class AddPersonnelController : Controller
    {

        private readonly IPersonnelsService _PersonnelsService;

        public AddPersonnelController(IPersonnelsService personnelsService)
        {

            _PersonnelsService = personnelsService;

        }

        // It views Add Personnel page
        public IActionResult AddPersonnel()
        {

            return View();

        }

        
        [HttpPost]
        public async Task<Personnels> PostOfAddingPersonnel(Personnels personnels)
        {

            var result = await _PersonnelsService.AddPerssonnel(personnels);

            return result;

        }

        [HttpPost]
        public async Task<List<MediaLibrary>> PersonnelSavePhoto(IFormCollection FieldForUploadingPhoto)
        {

            var result = await _PersonnelsService.PersonnelSavePhoto(FieldForUploadingPhoto);
            
            return result;

        }

        [HttpPost]
        public async Task<bool> SaveInstitutionData(IFormCollection InstitutionData)
        {

            var result = await _PersonnelsService.SaveInstitutionData(InstitutionData);

            return result;

        }

        [HttpGet]
        public async Task<List<ParamInstitution>> GetAllInstitutions()
        {
            var result = await _PersonnelsService.GetAllInstitutions();

            return result;
        }

    }
}
