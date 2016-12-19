using ElectronicSchem.Models.ElectronicSchemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ViewModels
{
    public class MedalViewModel
    {
        public string Description { get; set; }

        public string Url { get; set; }

        public MedalViewModel(Medal medal)
        {
            Description = medal.Description;
            Url = medal.Url;
        }
    }
}