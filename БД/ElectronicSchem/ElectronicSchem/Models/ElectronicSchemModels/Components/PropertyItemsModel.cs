using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicSchem.Models.ElectronicSchemModels.Components
{
    public class PropertyItemsModel
    {
        [Key]
        public long ID { get; set; }

        public string Value { get; set; }

        public virtual PropertyModel Property { get; set; }
    }
}