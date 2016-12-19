using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ElectronicSchemModels
{
    public class Medal
    {
        public long ID { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public ApplicationUser User { get; set; }
    }
}