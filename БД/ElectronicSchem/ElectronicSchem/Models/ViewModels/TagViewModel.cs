using ElectronicSchem.Models.ElectronicSchemModels.Posts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ViewModels
{
    public class TagViewModel
    {
        public string value { get; set; }

        public long id { get; set; }

        public TagViewModel(TagModel tag)
        {
            value = tag.Value;
            id = tag.ID;
        }
    }
}