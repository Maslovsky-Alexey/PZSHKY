using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicSchem.Models.ElectronicSchemModels.Components
{
    public class InputModel
    {
        [Key]
        public long ID { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public string Color { get; set; }

        public virtual Components.ComponentModel Component { get; set; }
    }
}