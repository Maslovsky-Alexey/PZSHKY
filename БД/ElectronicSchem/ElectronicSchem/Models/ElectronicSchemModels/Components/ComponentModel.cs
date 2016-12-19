using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicSchem.Models.ElectronicSchemModels.Components
{
    public class ComponentModel
    {
        [Key]
        public long ID { get; set; }

        public string Name { get; set; }

        public string PositionX { get; set; }

        public string PositionY { get; set; }

        public string Url { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public int Rotation { get; set; }

        public virtual ICollection<PropertyModel> Properties { get; set; }

        public virtual ICollection<InputModel> Inputs { get; set; }

        public Posts.PostModel Post { get; set; }
    }
}